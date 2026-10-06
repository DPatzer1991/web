/**
 * Authentication plugin for DNS3L.
 *
 * Uses Dex as the OpenID Connect provider and `oidc-client-ts`
 * to implement the Authorization Code Flow with PKCE.
 *
 * The plugin exposes a global `$auth` API that intentionally mirrors
 * the interface previously provided by `@nuxtjs/auth-next`. This allows
 * existing components to keep using `$auth` while the underlying
 * authentication implementation is migrated to OIDC.
 *
 * Authentication flow:
 *
 *   DNS3L Web App
 *        ↓
 *   Dex (/auth)
 *        ↓
 *   LDAP / Active Directory
 *        ↓
 *   /login callback
 *        ↓
 *   ID / access / refresh tokens
 *
 * The ID token is later attached to DNS3L backend requests by the
 * shared API client.
 *
 * When `NUXT_PUBLIC_MOCK_AUTH=true` is configured, Dex is bypassed
 * and a local mock user is used instead.
 */
import { UserManager, WebStorageStateStore, type User } from 'oidc-client-ts'

// Shared storage keys and OIDC discovery path.
const REDIRECT_KEY = 'auth.redirect'
const DISCOVERY_PATH = '/.well-known/openid-configuration'
const MOCK_KEY = 'auth.mock'
// Development user used when mock authentication is enabled.
const MOCK_USER = { name: 'Mock User', email: 'mock@example.com', groups: ['read', 'write', 'example.com'] }

export default defineNuxtPlugin(async () => {
  // Load authentication configuration and router access.
  const config = useRuntimeConfig().public
  const router = useRouter()

  /**
 * Authentication mode.
 *
 * Mock authentication is enabled only when explicitly configured.
 * Otherwise the application uses the real Dex / OIDC authentication flow.
 */
  const mockAuth = config.mockAuth === true

  /**
   * Internal authentication state.
   * `user` contains application-facing claims while `oidcUser`
   * keeps the complete OIDC session including tokens and expiry data.
   */
  const state = reactive({
    loggedIn: false,
    user: null as null | Record<string, any>,
    oidcUser: null as null | User
  })
  
    /**
   * Synchronizes an OIDC user with the application authentication state.
   * Expired users are treated as logged out and are not exposed
   * to the rest of the application.
   */
  const apply = (u: User | null) => {
    const valid = !!u && !u.expired
    state.oidcUser = valid ? u : null
    state.loggedIn = valid
    state.user = valid ? { ...u!.profile } : null
  }

  /**
   * Ends the local session when the OIDC session can no longer
   * be refreshed or trusted.
   * Protected routes are left immediately. The current route is
   * remembered so the user can return to it after authenticating again.
   */
  const endSession = async (reason: string) => {
    console.warn('[auth] session closed:', reason)
    useNotification().notify('Your session has expired. Please log in again.', 'warning', 0)
    await um?.removeUser().catch(() => {})
    apply(null)
    if (router.currentRoute.value.meta.auth !== false) {
      sessionStorage.setItem(REDIRECT_KEY, router.currentRoute.value.fullPath)
      await router.push('/')
    }
  }

  /**
   * Restore a previously persisted mock session after a page reload.
   */
  if (mockAuth && localStorage.getItem(MOCK_KEY)) {
    state.loggedIn = true
    state.user = MOCK_USER
  }

  
  /** ---------------------------------------------------------------------------
   * OpenID Connect / Dex
   ---------------------------------------------------------------------------*/

  let um: UserManager | null = null
  if (!mockAuth) {
    /** Use the configured Dex discovery endpoint or the default `/auth`
    endpoint behind the same ingress as the DNS3L frontend.
    */
     const metadataUrl = String(config.authURL || window.location.origin + '/auth' + DISCOVERY_PATH)
    /** Configure the public DNS3L OIDC client.
     * The Authorization Code Flow uses PKCE, while the requested scopes
     * provide user claims, AD groups, refresh tokens and the dns3ld audience. 
    */
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
    /**Keep the local application state synchronized with OIDC lifecycle events.
     * Failed renewal or an expired access token ends the local session.
    */
    um.events.addUserLoaded(apply)
    um.events.addUserUnloaded(() => apply(null))
    um.events.addSilentRenewError(e => endSession('Token-Erneuerung fehlgeschlagen: ' + e.message))
    um.events.addAccessTokenExpired(() => endSession('Token abgelaufen'))

   /** Restore an existing OIDC session when the application starts.
    * If the stored session is expired, try to renew it with the refresh token.
    * Invalid stored sessions are removed and treated as logged out.
    */
    try {
      let u = await um.getUser()
      if (u?.expired) {
        u = u.refresh_token ? await um.signinSilent() : null
      }
      apply(u)
    } catch (e) {
      console.warn('[auth] Stored session is invalid', e)
      await um.removeUser().catch(() => {})
      apply(null)
    }
  }

    /** ---------------------------------------------------------------------------
    * Public $auth API
      --------------------------------------------------------------------------*/
  
  /**
    * Compatibility layer for the previous @nuxtjs/auth-next API.
    *
    * Existing components can continue to use `$auth.loggedIn`,
    * `$auth.user`, `$auth.strategy`, `loginWith()`, and related methods.
  */
  const auth = reactive({
    get loggedIn () { return state.loggedIn },
    get user () { return state.user },
  /**
   * Provides a compact view of the current authentication state
   * for diagnostics and compatibility with existing components.
   */
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
  /**
   * Exposes ID, access and refresh tokens using the previous
   * auth-next structure so existing code does not need to change
   * immediately during the migration.
   */
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

  /**
   * Starts authentication and remembers the route the user should
   * return to after login.
   *
   * In mock mode, authentication is performed locally without
   * contacting Dex.
   */
    async loginWith (_strategy?: string, opts?: { returnTo?: string }) {
      const returnTo = opts?.returnTo
        ?? sessionStorage.getItem(REDIRECT_KEY)
        ?? router.currentRoute.value.fullPath
      sessionStorage.removeItem(REDIRECT_KEY)
      if (mockAuth) {
        state.loggedIn = true
        state.user = MOCK_USER
        localStorage.setItem(MOCK_KEY, '1') // übersteht Reloads wie der echte Login
        if (returnTo !== router.currentRoute.value.fullPath) await router.push(returnTo)
        return
      }
      await um!.signinRedirect({ state: { returnTo } })
    },

  /**
   * Completes the OIDC redirect callback from Dex.
   *
   * oidc-client-ts exchanges the authorization code for tokens
   * and restores the route the user originally wanted to open.
   */
    async handleCallback (): Promise<string> {
      const u = await um!.signinRedirectCallback()
      const s = u.state as { returnTo?: string } | undefined
      return s?.returnTo && s.returnTo !== '/login' ? s.returnTo : '/'
    },
  /**
   * Removes the current authentication session.
   *
   * If Dex provides an OIDC end-session endpoint, a provider logout
   * is performed. Otherwise only the locally stored OIDC session
   * is removed.
   */
    async logout () {
      if (mockAuth) {
        state.loggedIn = false
        state.user = null
        localStorage.removeItem(MOCK_KEY)
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
  /**
   * Reloads the currently stored OIDC user into the application state.
   */
    async fetchUser () {
      if (mockAuth || !um) return
      apply(await um.getUser())
    },
  /**
   * Explicitly renews the current OIDC tokens.
   *
   * If no refresh token exists, a new interactive login is started.
   */
    async refreshTokens () {
      if (mockAuth || !um) return
      if (!state.oidcUser?.refresh_token) return auth.loginWith()
      try {
        await um.signinSilent()
      } catch (e: any) {
        await endSession('Token-renewal failed: ' + e.message)
      }
    },

  /**
   * AD groups provided by Dex through the user claims.
   *
   * `read` and `write` may be used for frontend visibility rules.
   * Additional groups may represent DNS zones the user is allowed
   * to access.
   *
   * Final authorization must still be enforced by the backend.
   */
    get groups (): string[] {
      return (state.user?.groups ?? []) as string[]
    },
  /**
   * Checks whether the current user belongs to the specified
   * Dex / AD group.
   */
    hasScope (group: string) {
      return auth.groups.includes(group)
    }
  })
/**
 * Makes the authentication service globally available
 * as `nuxtApp.$auth`.
 */
  return { provide: { auth } }
})
