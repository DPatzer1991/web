// Lokales Mock-Backend: GET /mock/ca
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
