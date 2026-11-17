/**
 * Mock implementation of the DNS3L `/ca` endpoint.
 *
 * Returns the four certificate authorities used in the product mockup: a
 * public production CA, a staging CA, a European CA and a private internal
 * one. The shape matches api/v1 CAInfo field by field, so the frontend takes
 * the exact same code path for mock and live data - that is the whole point of
 * this mock, and the reason no field here is invented.
 *
 * The counters are derived from the caller's own certificate store rather than
 * hardcoded, using the daemon's own rule: a certificate counts as valid while
 * valid_start_time < now < valid_end_time (ca/state/dbstate.go). This way a
 * claim or delete through the mock immediately moves the percentage for that
 * visitor, as it would in production, without touching anyone else's numbers.
 *
 * Logos point at files already present in public/. An operator replacing them
 * is covered by CaLogo's fallback chain, not by this file.
 */
export default defineEventHandler((event) => {
  const crts = crtsFor(event)
  const now = Date.now()

  const counts = (caId: string) => {
    const list = crts[caId] ?? []
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
      logo: '/le.png',
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
      logo: '/le.png',
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
      logo: '/t.png',
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
      logo: '/janedoe_logo.svg',
      url: '',
      roots: '',
      ...counts('internal')
    }
  ]
})