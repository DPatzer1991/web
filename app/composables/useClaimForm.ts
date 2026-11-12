import type { MaybeRefOrGetter } from 'vue'

/**
 * Everything needed to claim a certificate: state, validation and the request.
 *
 * Kept apart from the markup for one reason: the claim form exists more than
 * once - as this page and as a dialog on a CA's certificate list - and the two
 * must never drift apart in what they accept or what they send. Anything that
 * is presentation (focus, navigation, dialog state) stays in the component.
 *
 * The daemon validates everything again (api/v1 CertClaimInfo carries the
 * validation tags) and its verdict is the binding one. Checking here only
 * saves a round trip and a failed ACME order on obvious typos.
 *
 * @param initialCa CA id to start from. Pass a ref or getter when the caller
 *                  knows the CA; leave it out when the user picks one.
 */
export function useClaimForm(initialCa?: MaybeRefOrGetter<string>) {
  const { $api } = useNuxtApp()
  const { data: rootZones, loading: zonesLoading } = useRootZones()

  /* --- State ----------------------------------------------------------- */

  const ca = ref(toValue(initialCa) ?? '')
  // Follow the caller when its CA changes, e.g. navigating between CA pages.
  watch(() => toValue(initialCa), (v) => { if (v) ca.value = v })

  const prefix = ref('')
  const rtz = ref('')
  const san = ref('')
  const wildcard = ref(false)
  const autodns = ref(false)
  const ip = ref('')

  const loading = ref(false)
  const errorText = ref('')

  /* --- Root zones ------------------------------------------------------ */

  /**
   * Root zones offered for the selected CA.
   *
   * The backend reports which CAs may issue for a zone (DNSRootzoneInfo.ca).
   * Older daemons and the mock may omit that field, in which case every zone
   * is offered rather than none.
   */
  const zones = computed(() => {
    const all = rootZones.value ?? []
    if (!ca.value) return all
    return all.filter(z => !z.ca?.length || z.ca.includes(ca.value))
  })

  // Drop a suffix the current CA cannot serve; preselect when there is only one.
  watch(zones, (list) => {
    if (rtz.value && !list.some(z => z.root === rtz.value)) rtz.value = ''
    if (!rtz.value && list.length === 1) rtz.value = list[0]!.root
  }, { immediate: true })

  /**
   * AutoDNS is offered only when the selected zone has a provider for it, and
   * never together with a wildcard: an A record points at one address, which a
   * wildcard name cannot express.
   */
  const autodnsAvailable = computed(() => {
    if (wildcard.value || !rtz.value) return false
    return !!rootZones.value.find(z => z.root === rtz.value)?.autodns
  })

  watch(autodnsAvailable, (ok) => {
    if (!ok) { autodns.value = false; ip.value = '' }
  })

  /* --- Validation ------------------------------------------------------ */

  // RFC 1123 host name, optionally multi-label: "app" or "x5c.foobar".
  const HOSTNAME = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/
  // Same, but a leading "*." is allowed for SANs.
  const SAN_NAME = /^(\*\.)?(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/
  const IPV4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/

  const sanParts = computed(() => (san.value ? san.value.split(/\s*,\s*/).filter(Boolean) : []))

  const errors = reactive({ ca: false, rtz: false, prefix: false, san: false, ip: false })

  /**
   * The first unmet requirement, as one sentence.
   *
   * One message at a time beats five red fields: it says what to do next
   * instead of what is wrong everywhere. It also gates the submit button, so
   * an incomplete form cannot be sent at all.
   */
  const hint = computed(() => {
    if (!ca.value) return 'Choose a certificate authority'
    if (!prefix.value) return 'Enter an FQDN prefix'
    if (!HOSTNAME.test(prefix.value)) return 'The FQDN prefix contains invalid characters'
    if (!rtz.value) return 'Choose a domain suffix'
    if (sanParts.value.some(s => !SAN_NAME.test(s))) return 'One of the SANs is not a valid name'
    if (autodns.value && !IPV4.test(ip.value)) return 'Enter the IPv4 address for the A record'
    return null
  })

  /** Marks the individual fields; only called on a submit attempt. */
  function validate() {
    errors.ca = !ca.value
    errors.prefix = !prefix.value || !HOSTNAME.test(prefix.value)
    errors.rtz = !rtz.value
    errors.san = sanParts.value.some(s => !SAN_NAME.test(s))
    errors.ip = autodns.value && !IPV4.test(ip.value)
    return !Object.values(errors).some(Boolean)
  }

  /* --- Preview --------------------------------------------------------- */

  const trimDot = (n: string) => n.replace(/\.$/, '')

  /** The bare name that is sent; the wildcard is a flag, not part of it. */
  const name = computed(() =>
    prefix.value && rtz.value ? `${prefix.value}.${trimDot(rtz.value)}` : ''
  )

  /** The common name as it will appear in the certificate. */
  const fqdn = computed(() => (name.value ? `${wildcard.value ? '*.' : ''}${name.value}` : ''))

  /** SAN prefixes expanded with the selected suffix, exactly as on submit. */
  const sanList = computed(() =>
    rtz.value ? sanParts.value.map(s => `${s}.${trimDot(rtz.value)}`) : sanParts.value
  )

  /** The endpoint an application polls for the renewed full chain. */
  const endpoint = computed(() =>
    `/api/v1/ca/${ca.value || '<ca>'}/crt/${name.value || '<name>'}/pem/fullchain`
  )

  /* --- Actions --------------------------------------------------------- */

  /**
   * Send the claim.
   *
   * Returns the claimed name on success and null on failure, so the caller
   * decides what happens next - this page navigates to the CA's list, a dialog
   * would close and refresh in place.
   *
   * Body per api/v1 CertClaimInfo. `autodns` is omitted entirely rather than
   * sent as null when it is off, and `san` likewise when empty.
   */
  async function submit(): Promise<string | null> {
    if (!validate()) return null
    loading.value = true
    errorText.value = ''
    try {
      await $api(`/ca/${ca.value}/crt`, {
        method: 'POST',
        body: {
          name: name.value,
          wildcard: wildcard.value,
          ...(sanList.value.length ? { san: sanList.value } : {}),
          ...(autodns.value ? { autodns: { ipv4: ip.value } } : {})
        }
      })
      return name.value
    } catch (e) {
      errorText.value = apiErrorText(e)
      return null
    } finally {
      loading.value = false
    }
  }

  /** Clear the inputs. The CA selection is kept: it is the context, not input. */
  function reset() {
    prefix.value = ''
    rtz.value = zones.value.length === 1 ? zones.value[0]!.root : ''
    san.value = ''
    wildcard.value = false
    autodns.value = false
    ip.value = ''
    errorText.value = ''
    for (const k of Object.keys(errors) as (keyof typeof errors)[]) errors[k] = false
  }

  return {
    ca, prefix, rtz, san, wildcard, autodns, ip,
    zones, zonesLoading, autodnsAvailable,
    errors, hint, validate,
    name, fqdn, sanList, endpoint,
    loading, errorText, submit, reset
  }
}