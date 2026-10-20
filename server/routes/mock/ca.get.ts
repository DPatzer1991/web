/**
 * Mock implementation of the DNS3L `/ca` endpoint.
 *
 * Returns the four certificate authorities used in the product mockup.
 * The response structure mirrors the real backend (api/v1 CAInfo), so the
 * frontend code paths are identical for mock and live data.
 *
 * The counters are derived from the mock certificate store, using the same
 * rule as the daemon: a certificate counts as valid while
 * valid_start_time < now < valid_end_time.
 */
export default defineEventHandler(() => {
  const now = Date.now()

  const counts = (caId: string) => {
    const list = mockCrts[caId] ?? []
    return {
      totalIssued: list.length,
      totalValid: list.filter(
        c => +new Date(c.validFrom) < now && +new Date(c.validTo) > now
      ).length
    }
  }

  return [
    {
      id: 'letsencrypt',
      name: "Let's Encrypt",
      desc: 'Public ACME CA for internet-facing services (Mock)',
      type: 'public',
      acme: true,
      enabled: true,
      logo: '/ca-logos/letsencrypt.svg',
      url: 'https://letsencrypt.org',
      roots: 'https://letsencrypt.org/certificates/',
      ...counts('letsencrypt')
    },
    {
      id: 'letsencrypt-staging',
      name: "Let's Encrypt Staging",
      desc: 'Untrusted test CA without rate limits (Mock)',
      type: 'public',
      acme: true,
      enabled: true,
      logo: '/ca-logos/letsencrypt.svg',
      url: 'https://letsencrypt.org/docs/staging-environment/',
      roots: '',
      ...counts('letsencrypt-staging')
    },
    {
      id: 'telesec',
      name: 'TeleSec',
      desc: 'European trust service provider, organization validation (Mock)',
      type: 'public',
      acme: true,
      enabled: true,
      logo: '/ca-logos/telesec.png',
      url: 'https://www.telesec.de',
      roots: '',
      ...counts('telesec')
    },
    {
      id: 'internal',
      name: 'Jane Doe Internal CA',
      desc: 'Private CA for internal services, not publicly trusted (Mock)',
      type: 'private',
      acme: true,
      enabled: true,
      logo: '/ca-logos/jane-doe.svg',
      url: '',
      roots: '',
      ...counts('internal')
    }
  ]
})