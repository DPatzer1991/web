/**
 * Shared in-memory data and helper functions for the local DNS3L mock backend.
 *
 * The mock data is stored only in memory and is recreated whenever
 * the development server restarts.
 *
 * This module provides:
 * - mock certificate data
 * - certificate generation helpers
 * - PEM generation
 * - reset support for automated tests
 * - a lightweight Bearer-token check for protected mock endpoints
 */

export interface MockCrt {
  name: string
  wildcard: boolean
  renewCount: number
  serial: string
  claimedOn: string
  claimedBy: { name: string, email: string }
  validFrom: string
  validTo: string
  valid: boolean
}

/**
 * Date helpers used to generate realistic certificate validity periods.
 *
 * `iso()` returns an ISO timestamp relative to the current date.
 * Negative values represent dates in the past, positive values dates
 * in the future.
 */
const day = 24 * 60 * 60 * 1000
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * day).toISOString()


/**
 * Counter used to generate unique-looking mock certificate serial numbers.
 *
 * The generated serials are only intended for local development and
 * do not represent real CA-issued serial numbers.
 */
let serialCounter = 1000000

/**
 * Creates a mock certificate with the same basic structure expected
 * from the real DNS3L backend.
 *
 * Certificate names are normalized to fully qualified DNS names
 * by adding a trailing dot when necessary.
 *
 * The `from` and `to` parameters define the validity period relative
 * to the current date.
 */
export const mockCrt = (name: string, wildcard = false, from = -10, to = 80): MockCrt => ({
  name: name.endsWith('.') ? name : name + '.',
  wildcard,
  renewCount: 0,
  serial: String(++serialCounter * 7919),
  claimedOn: iso(from),
  claimedBy: { name: 'Mock User', email: 'mock@example.com' },
  validFrom: iso(from),
  validTo: iso(to),
  valid: true
})

/**
 * Creates the initial mock certificate store.
 *
 * Different validity periods and certificate types are intentionally
 * included so the frontend can test normal, wildcard and soon-to-expire
 * certificate states.
 */
const initialCrts = (): Record<string, MockCrt[]> => ({
  le: [
    mockCrt('app.example.com'),
    mockCrt('api.example.com', false, -60, 30),
    mockCrt('example.com', true, -85, 5)
  ],
  step: [
    mockCrt('intern.example.org', false, -2, 88)
  ]
})

/**
 * Current in-memory certificate store grouped by certificate authority.
 *
 * API handlers modify this object directly when certificates are
 * created or deleted. All changes are lost when the server restarts.
 */
export const mockCrts: Record<string, MockCrt[]> = initialCrts()

/**
 * Restores the mock certificate store to its initial state.
 *
 * Primarily used by automated tests so each test can start with
 * predictable and identical mock data.
 */
export const resetMock = () => {
  for (const k of Object.keys(mockCrts)) delete mockCrts[k]
  Object.assign(mockCrts, initialCrts())
}

/**
 * Normalizes a DNS name by removing an optional trailing dot.
 *
 * This allows names such as `example.com` and `example.com.`
 * to be treated as equivalent during comparisons and file generation.
 */
export const trimDot = (n: string) => n.replace(/\.?$/, '')


/**
 * Generates placeholder PEM data for a certificate.
 *
 * The returned structure mirrors the real backend response and contains
 * certificate, chain, private key and fullchain values.
 *
 * These values are test strings only and are not valid cryptographic
 * certificates or private keys.
 */
export const mockPem = (name: string) => {
  const block = (t: string) => `-----BEGIN ${t}-----\nMOCK-${trimDot(name)}\n-----END ${t}-----\n`
  const cert = block('CERTIFICATE')
  const chain = block('CERTIFICATE')
  return { cert, chain, key: block('PRIVATE KEY'), fullchain: cert + chain }
}

/**
 * Performs a lightweight authentication check for protected mock endpoints.
 *
 * The mock backend only verifies that an Authorization header using
 * the Bearer scheme is present. It does not validate the token itself,
 * its signature, issuer, audience, expiry or user permissions.
 *
 * Full token validation remains the responsibility of the real backend.
 */
export const requireToken = (event: Parameters<typeof getHeader>[0]) => {
  const auth = getHeader(event, 'authorization') ?? ''
  if (!auth.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', data: { code: 401, message: 'missing bearer token' } })
  }
}
