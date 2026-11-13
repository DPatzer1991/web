/**
 * Shared in-memory data and helper functions for the local DNS3L mock backend.
 *
 * The mock data is stored only in memory and is recreated whenever
 * the development server restarts.
 *
 * This module provides:
 * - mock certificate data, isolated per demo visitor
 * - certificate generation helpers
 * - PEM generation
 * - reset support for automated tests
 * - a lightweight Bearer-token check for protected mock endpoints
 */
import type { H3Event } from 'h3'

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
 * to the current date. A certificate whose `to` lies in the past is
 * marked invalid, which is how the mock produces CAs with a valid
 * share below 100 %.
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
  valid: to > 0
})

/**
 * Creates the initial mock certificate store.
 *
 * The data mirrors the product mockup: a public CA with one certificate
 * about to expire, an untrusted staging CA, a European CA with a single
 * long-lived certificate and a private CA with a larger mixed inventory.
 * Expired certificates are kept on purpose so the "% valid" indicator
 * shows realistic values instead of a constant 100 %.
 */
const initialCrts = (): Record<string, MockCrt[]> => ({
  // 4 certificates, 3 currently valid -> 75 %
  letsencrypt: [
    mockCrt('example.com', true, -86, 4),            // critical: 4 days left
    mockCrt('api.example.com', false, -61, 29),      // due: 29 days left
    mockCrt('app.example.com', false, -10, 80),      // valid
    mockCrt('legacy.example.com', false, -180, -12)  // expired, still on record
  ],
  // 2 certificates, both valid -> 100 %
  'letsencrypt-staging': [
    mockCrt('ci.example.com', false, -29, 61),
    mockCrt('test.example.com', false, -5, 85)
  ],
  // 1 certificate, valid -> 100 %
  telesec: [
    mockCrt('shop.telekom.example', false, -223, 142)
  ],
  // 6 certificates, 5 currently valid -> 83 %
  internal: [
    mockCrt('grafana.internal.example', false, -78, 12),  // due
    mockCrt('vault.internal.example', false, -50, 40),
    mockCrt('registry.internal.example', false, -20, 70),
    mockCrt('ci.internal.example', true, -12, 78),
    mockCrt('wiki.internal.example', false, -3, 87),
    mockCrt('old.internal.example', false, -200, -30)     // expired
  ]
})

/**
 * One certificate store per demo visitor, selected by the X-Demo-Session
 * header. Isolation matters because demo users may claim and delete, and
 * they must not see each other's changes.
 *
 * The store is deliberately bounded. The header is supplied by the client,
 * so without a cap anyone could allocate memory at will by sending a new
 * value on every request. Idle sessions expire, and once MAX_SESSIONS is
 * reached the least recently used one is dropped: a flood then only evicts
 * other demos instead of taking the process down.
 *
 * Everything is lost on a server restart, which is fine for a demo.
 */
const sessions = new Map<string, { crts: Record<string, MockCrt[]>, seen: number }>()
const TTL = 60 * 60 * 1000              // one idle hour
const MAX_SESSIONS = 500
const MAX_CRTS_PER_SESSION = 100        // one visitor cannot grow without bound

export const crtsFor = (event: H3Event) => {
  const now = Date.now()
  for (const [k, v] of sessions) if (now - v.seen > TTL) sessions.delete(k)

  const id = getHeader(event, 'x-demo-session') || 'demo-shared'
  let s = sessions.get(id)
  if (s) {
    // Deleted here and re-inserted below, so the Map's insertion order
    // doubles as a least-recently-used order.
    sessions.delete(id)
  } else {
    while (sessions.size >= MAX_SESSIONS) {
      sessions.delete(sessions.keys().next().value!)
    }
    s = { crts: initialCrts(), seen: now }
  }
  s.seen = now
  sessions.set(id, s)
  return s.crts
}

/** True once a visitor has filled their sandbox; used to refuse further claims. */
export const atClaimLimit = (crts: Record<string, MockCrt[]>) =>
  Object.values(crts).reduce((n, list) => n + list.length, 0) >= MAX_CRTS_PER_SESSION

/** Resets only the caller's own sandbox. */
export const resetMock = (event: H3Event) => {
  const id = getHeader(event, 'x-demo-session') || 'demo-shared'
  sessions.set(id, { crts: initialCrts(), seen: Date.now() })
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