// In-Memory-Daten für das lokale Mock-Backend (gehen beim Neustart verloren)
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

const day = 24 * 60 * 60 * 1000
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * day).toISOString()

let serialCounter = 1000000
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

export const mockCrts: Record<string, MockCrt[]> = {
  le: [
    mockCrt('app.example.com'),
    mockCrt('api.example.com', false, -60, 30),
    mockCrt('example.com', true, -85, 5)
  ],
  step: [
    mockCrt('intern.example.org', false, -2, 88)
  ]
}

export const trimDot = (n: string) => n.replace(/\.?$/, '')

export const mockPem = (name: string) => {
  const block = (t: string) => `-----BEGIN ${t}-----\nMOCK-${trimDot(name)}\n-----END ${t}-----\n`
  const cert = block('CERTIFICATE')
  const chain = block('CERTIFICATE')
  return { cert, chain, key: block('PRIVATE KEY'), fullchain: cert + chain }
}

// Wie das echte Backend: schützenswerte Endpunkte nur mit Token (Authorization: Bearer ...)
export const requireToken = (event: Parameters<typeof getHeader>[0]) => {
  const auth = getHeader(event, 'authorization') ?? ''
  if (!auth.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', data: { code: 401, message: 'missing bearer token' } })
  }
}
