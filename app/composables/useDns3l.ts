// Gemeinsame Datenquellen des DNS3L-Backends.
// Gleicher Schlüssel = Daten werden nur einmal geladen und von allen
// Komponenten geteilt (z. B. die CA-Liste in Tabelle, Karten, Claim, Detailseite).
// Nach Login/Logout wird automatisch neu geladen, weil das Backend
// je nach Benutzer andere Daten liefern kann.

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
  // nur im Frontend gesetzt:
  pem?: Record<string, string>
  loaded?: boolean
  [copied: string]: unknown
}

// "loading" ist auch vor dem ersten Abruf (status "idle") true,
// damit Templates nicht mit leeren Standardwerten rendern
const withLoading = <T extends { status: Ref<string> }>(r: T) =>
  Object.assign(r, { loading: computed(() => r.status.value === 'idle' || r.status.value === 'pending') })

const loginState = () => {
  const { $auth } = useNuxtApp()
  return () => $auth.loggedIn
}

export const useCaList = () => {
  const api = useApi()
  return withLoading(useAsyncData('dns3l-ca', () => api<Ca[]>('/ca'), {
    default: () => [] as Ca[],
    watch: [loginState()]
  }))
}

export const useRootZones = () => {
  const api = useApi()
  return withLoading(useAsyncData('dns3l-rtzn', () => api<RootZone[]>('/dns/rtzn'), {
    default: () => [] as RootZone[],
    watch: [loginState()]
  }))
}

export const useInfo = () => {
  const api = useApi()
  return withLoading(useAsyncData('dns3l-info', () => api<Record<string, any>>('/info'), {
    default: () => ({}) as Record<string, any>
  }))
}

export const useCertificates = (ca: string) => {
  const api = useApi()
  return withLoading(useAsyncData('dns3l-crt-' + ca, () => api<Crt[]>('/ca/' + ca + '/crt'), {
    default: () => [] as Crt[],
    deep: true, // Einträge werden im Frontend ergänzt (pem, loaded, …Copied)
    watch: [loginState()]
  }))
}
