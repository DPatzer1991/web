/**
 * Shared DNS3L backend data composables.
 *
 * Each resource uses a stable `useAsyncData` key so multiple components
 * share the same state instead of maintaining separate copies.
 *
 * User-dependent resources are refreshed automatically when the
 * authentication state changes.
 */

export interface Ca {
  id: string
  name: string
  desc?: string
  type: 'public' | 'private' | string
  acme: boolean
  enabled: boolean
  logo?: string
  url?: string
  roots?: string
  totalValid: number
  totalIssued: number
}

export interface RootZone {
  root: string
  autodns: string | null
  acmedns: string | null
}

export interface Crt {
  name: string
  wildcard: boolean
  renewCount: number
  serial: string
  claimedOn: string
  claimedBy: { name?: string, email?: string }
  validFrom: string
  validTo: string
  valid: boolean
    /**
   * Client-side state.
   * These properties are added by the frontend and are not part
   * of the certificate response returned by the backend.
   */
  pem?: Record<string, string>
  loaded?: boolean
  [copied: string]: unknown
}

/**
 * Adds a convenient `loading` flag to Nuxt AsyncData.
 *
 * `idle` is treated as loading as well, preventing components from
 * briefly rendering empty default data before the first request starts.
 */
const withLoading = <T extends { status: Ref<string> }>(r: T) =>
  Object.assign(r, { loading: computed(() => r.status.value === 'idle' || r.status.value === 'pending') })

/**
 * Returns a reactive getter for the current authentication state.
 * Used by `useAsyncData` watchers to refresh user-dependent resources
 * after login or logout.
 */
const loginState = () => {
  const { $auth } = useNuxtApp()
  return () => $auth.loggedIn
}

/**
 * Loads the available certificate authorities.
 *
 * Shared through the `dns3l-ca` AsyncData key and refreshed whenever
 * the authentication state changes.
 */
export const useCaList = () => {
  const api = useApi()
  return withLoading(useAsyncData('dns3l-ca', () => api<Ca[]>('/ca'), {
    default: () => [] as Ca[],
    watch: [loginState()]
  }))
}

/**
 * Loads the DNS root zones available to the current user.
 * The list is refreshed after login or logout.
 */
export const useRootZones = () => {
  const api = useApi()
  return withLoading(useAsyncData('dns3l-rtzn', () => api<RootZone[]>('/dns/rtzn'), {
    default: () => [] as RootZone[],
    watch: [loginState()]
  }))
}


/**
 * Loads general DNS3L backend information.
 */
export const useInfo = () => {
  const api = useApi()
  return withLoading(useAsyncData('dns3l-info', () => api<Record<string, any>>('/info'), {
    default: () => ({}) as Record<string, any>
  }))
}


/**
 * Loads all certificates issued by the given certificate authority.
 *
 * Each CA receives its own AsyncData key, e.g.
 * `dns3l-crt-letsencrypt`.
 *
 * Deep reactivity is enabled because certificate objects are enriched
 * with client-side state such as `pem` and `loaded`.
 */
export const useCertificates = (ca: string) => {
  const api = useApi()
  return withLoading(useAsyncData('dns3l-crt-' + ca, () => api<Crt[]>('/ca/' + ca + '/crt'), {
    default: () => [] as Crt[],
    deep: true, // Einträge werden im Frontend ergänzt (pem, loaded, …Copied)
    watch: [loginState()]
  }))
}
