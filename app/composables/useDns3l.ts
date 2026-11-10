/**
 * Shared DNS3L backend data composables.
 *
 * Each resource uses a stable `useAsyncData` key so multiple components
 * share the same state instead of maintaining separate copies.
 *
 * The key contains the active data source, so mock and live results never
 * share a cache entry, and switching source refetches automatically.
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
  /** CAs allowed to issue for this zone; reported by the backend as `ca`. */
  ca?: string[]
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
 * Reactive getter for the active data source.
 *
 * It serves two purposes at once, and both matter:
 *
 * - It is part of every AsyncData key. Without that, mock and live results
 *   would share one cache entry, and a company user would see demo data for a
 *   moment right after signing in - the worst possible moment to show someone
 *   certificates that are not theirs.
 *
 * - It is the watch source. Changing it (by signing in or out) invalidates the
 *   key and triggers a refetch, so no component has to listen for auth events.
 *
 * This replaces the former loginState() watcher, which only reacted to the
 * login flag and could not distinguish the two backends.
 */
const source = () => {
  const nuxtApp = useNuxtApp()
  return computed(() => apiSource(nuxtApp))
}

/**
 * Loads the available certificate authorities.
 *
 * The response carries everything the overview page needs, including the
 * totalValid / totalIssued counters, so a CA card never has to fetch
 * certificates of its own.
 */
export const useCaList = () => {
  const api = useApi()
  const src = source()
  return withLoading(useAsyncData(
    () => `dns3l-ca-${src.value}`,
    () => api<Ca[]>('/ca'),
    { default: () => [] as Ca[], watch: [src] }
  ))
}

/**
 * Loads the DNS root zones available to the current user.
 *
 * Used by the claim form to offer valid domain suffixes. The real endpoint
 * requires a token, so signed-out visitors see the mock zones instead.
 */
export const useRootZones = () => {
  const api = useApi()
  const src = source()
  return withLoading(useAsyncData(
    () => `dns3l-rtzn-${src.value}`,
    () => api<RootZone[]>('/dns/rtzn'),
    { default: () => [] as RootZone[], watch: [src] }
  ))
}

/**
 * Loads general DNS3L backend information (versions, contact).
 *
 * Shown in the footer. Keyed by source as well, so the footer does not claim
 * a daemon version that belongs to the mock.
 */
export const useInfo = () => {
  const api = useApi()
  const src = source()
  return withLoading(useAsyncData(
    () => `dns3l-info-${src.value}`,
    () => api<Record<string, any>>('/info'),
    { default: () => ({}) as Record<string, any>, watch: [src] }
  ))
}

/**
 * Loads all certificates issued by the given certificate authority.
 *
 * Note what the daemon does and does not offer here: it supports `search`,
 * `suffix`, `limit` and `offset`, but no sort parameter - results come back
 * ordered by domain name (ca/state/dbstate.go). Any ordering by expiry would
 * have to happen in the browser over the full list, which is why the overview
 * page deliberately does not show an expiry preview.
 *
 * Deep reactivity is enabled because certificate objects are enriched with
 * client-side state such as `pem` and `loaded` on the detail page.
 */
export const useCertificates = (ca: string) => {
  const api = useApi()
  const src = source()
  return withLoading(useAsyncData(
    () => `dns3l-crt-${src.value}-${ca}`,
    () => api<Crt[]>('/ca/' + ca + '/crt'),
    { default: () => [] as Crt[], deep: true, watch: [src] }
  ))
}