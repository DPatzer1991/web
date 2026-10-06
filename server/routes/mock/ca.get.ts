/**
 * Mock implementation of the DNS3L `/ca` endpoint.
 *
 * Returns a static list of certificate authorities for local development.
 * The response structure mirrors the real backend API so the frontend
 * can be developed and tested without a running DNS3L backend.
 *
 * Certificate counters are derived from the local mock certificate data
 * to keep the CA overview consistent with the mocked certificate lists.
 */
export default defineEventHandler(() => [
  {
    id: 'le',
    name: "Let's Encrypt",
    desc: 'Public ACME CA (Mock)',
    type: 'public',
    acme: true,
    enabled: true,
    logo: '/le.png',
    url: 'https://letsencrypt.org',
    roots: 'https://letsencrypt.org/certificates/',
    totalValid: (mockCrts.le ?? []).length,
    totalIssued: (mockCrts.le ?? []).length + 1
  },
  {
    id: 'step',
    name: 'Step CA',
    desc: 'Private ACME CA (Mock)',
    type: 'private',
    acme: true,
    enabled: true,
    logo: '/ss.png',
    url: 'https://smallstep.com',
    roots: '',
    totalValid: (mockCrts.step ?? []).length,
    totalIssued: (mockCrts.step ?? []).length
  }
])
