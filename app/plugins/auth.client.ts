// OIDC-Login gegen Dex (dns3l/auth) mit oidc-client-ts.
// Stellt $auth mit derselben Schnittstelle wie früher @nuxtjs/auth-next bereit,
// damit die bestehenden Komponenten unverändert bleiben können.
//
// Hintergrund (siehe dns3l/auth):
// - Dex läuft hinter demselben Ingress unter /auth und prüft die Anmeldung per LDAP/AD.
// - Client "dns3l-app" ist öffentlich (kein Secret) -> Code-Flow mit PKCE.
// - Scope audience:server:client_id:dns3ld -> Backend akzeptiert den ID-Token.
// - Dex speichert Sitzungen nur im Speicher: nach einem Dex-Neustart sind
//   Refresh-Tokens ungültig -> Sitzung wird hier sauber beendet.
//
// Mit NUXT_PUBLIC_MOCK_AUTH=true wird statt Dex ein Mock-Benutzer eingeloggt.
import { UserManager, WebStorageStateStore, type User } from 'oidc-client-ts'

const REDIRECT_KEY = 'auth.redirect'
const DISCOVERY_PATH = '/.well-known/openid-configuration'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig().public
  const router = useRouter()
  const mockAuth = config.mockAuth === true

  const state = reactive({
    loggedIn: false,
    user: null as null | Record<string, any>,
    oidcUser: null as null | User
  })

  const apply = (u: User | null) => {
    const valid = !!u && !u.expired
    state.oidcUser = valid ? u : null
    state.loggedIn = valid
    state.user = valid ? { ...u!.profile } : null
  }

  // Sitzung ist nicht mehr gültig (z. B. Dex neu gestartet): lokal abmelden
  // und eine geschützte Seite verlassen.
  const endSession = async (reason: string) => {
    console.warn('[auth] Sitzung beendet:', reason)
    useNotification().notify('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.', 'warning', 0)
    await um?.removeUser().catch(() => {})
    apply(null)
    if (router.currentRoute.value.meta.auth !== false) {
      sessionStorage.setItem(REDIRECT_KEY, router.currentRoute.value.fullPath)
      await router.push('/')
    }
  }

  // ---------- OIDC (Dex) ----------
  let um: UserManager | null = null
  if (!mockAuth) {
    // Ohne Angabe liegt Dex hinter demselben Ingress unter /auth
    const metadataUrl = String(config.authURL || window.location.origin + '/auth' + DISCOVERY_PATH)
    um = new UserManager({
      authority: metadataUrl.replace(new RegExp(DISCOVERY_PATH + '/?$'), ''),
      metadataUrl,
      client_id: String(config.clientId),
      redirect_uri: window.location.origin + '/login', // in Dex für dns3l-app freigegeben
      post_logout_redirect_uri: window.location.origin + '/',
      response_type: 'code',
      scope: [
        'openid', 'profile', 'email', 'groups', 'offline_access',
        'audience:server:client_id:' + config.daemonClientId
      ].join(' '),
      automaticSilentRenew: true, // erneuert per Refresh-Token kurz vor Ablauf
      userStore: new WebStorageStateStore({ store: window.localStorage })
    })

    um.events.addUserLoaded(apply)
    um.events.addUserUnloaded(() => apply(null))
    um.events.addSilentRenewError(e => endSession('Token-Erneuerung fehlgeschlagen: ' + e.message))
    um.events.addAccessTokenExpired(() => endSession('Token abgelaufen'))

    // Beim Start: gespeicherte Sitzung laden, abgelaufene per Refresh-Token erneuern
    try {
      let u = await um.getUser()
      if (u?.expired) {
        u = u.refresh_token ? await um.signinSilent() : null
      }
      apply(u)
    } catch (e) {
      console.warn('[auth] Gespeicherte Sitzung ungültig', e)
      await um.removeUser().catch(() => {})
      apply(null)
    }
  }

  // ---------- Öffentliche Schnittstelle ($auth) ----------
  const auth = reactive({
    get loggedIn () { return state.loggedIn },
    get user () { return state.user },
    get $state () {
      return {
        loggedIn: state.loggedIn,
        strategy: mockAuth ? 'mock' : 'dex',
        user: state.user,
        expiresAt: state.oidcUser?.expires_at
          ? new Date(state.oidcUser.expires_at * 1000).toISOString()
          : null,
        scopes: state.oidcUser?.scopes ?? []
      }
    },
    strategy: {
      idToken: { get: () => (mockAuth ? (state.loggedIn ? 'mock-id-token' : null) : state.oidcUser?.id_token ?? null) },
      token: {
        get: () => (mockAuth ? (state.loggedIn ? 'mock-access-token' : null) : state.oidcUser?.access_token ?? null),
        status: () => {
          if (!state.loggedIn) return 'unknown'
          if (mockAuth) return 'valid'
          return state.oidcUser?.expired ? 'expired' : 'valid'
        }
      },
      refreshToken: { get: () => (mockAuth ? null : state.oidcUser?.refresh_token ?? null) }
    },

    // Startet den Login. Nach der Rückkehr geht es zur gemerkten Seite weiter.
    async loginWith (_strategy?: string, opts?: { returnTo?: string }) {
      const returnTo = opts?.returnTo
        ?? sessionStorage.getItem(REDIRECT_KEY)
        ?? router.currentRoute.value.fullPath
      sessionStorage.removeItem(REDIRECT_KEY)
      if (mockAuth) {
        state.loggedIn = true
        state.user = { name: 'Mock User', email: 'mock@example.com', groups: ['read', 'write', 'example.com'] }
        if (returnTo !== router.currentRoute.value.fullPath) await router.push(returnTo)
        return
      }
      await um!.signinRedirect({ state: { returnTo } })
    },

    // Wird von /login aufgerufen, wenn Dex mit ?code=... zurückkommt.
    async handleCallback (): Promise<string> {
      const u = await um!.signinRedirectCallback()
      const s = u.state as { returnTo?: string } | undefined
      return s?.returnTo && s.returnTo !== '/login' ? s.returnTo : '/'
    },

    async logout () {
      if (mockAuth) {
        state.loggedIn = false
        state.user = null
      } else {
        // Dex hat in der dns3l/auth-Konfiguration keinen end_session_endpoint
        // -> nur lokal abmelden. Falls doch vorhanden, dorthin weiterleiten.
        const md = await um!.metadataService.getMetadata().catch(() => null)
        if (md?.end_session_endpoint) {
          await um!.signoutRedirect()
          return
        }
        await um!.removeUser()
      }
      await router.push('/')
    },

    async fetchUser () {
      if (mockAuth || !um) return
      apply(await um.getUser())
    },

    async refreshTokens () {
      if (mockAuth || !um) return
      if (!state.oidcUser?.refresh_token) return auth.loginWith()
      try {
        await um.signinSilent()
      } catch (e: any) {
        await endSession('Token-Erneuerung fehlgeschlagen: ' + e.message)
      }
    },

    // Gruppen aus dem AD (über Dex im Token). Das Backend entscheidet damit:
    // "read"/"write" = Rechte, weitere Gruppen = erlaubte DNS-Zonen.
    get groups (): string[] {
      return (state.user?.groups ?? []) as string[]
    },
    hasScope (group: string) {
      return auth.groups.includes(group)
    }
  })

  return { provide: { auth } }
})
