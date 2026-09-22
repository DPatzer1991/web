import { describe, it, expect } from 'vitest'
import { apiErrorText } from '~/utils/apiErrorText'

describe('apiErrorText', () => {
  it('formatiert HTTP-Fehler mit Backend-Meldung wie bisher', () => {
    const e = { status: 409, statusText: 'Conflict', data: { message: 'Certificate already exists' } }
    expect(apiErrorText(e)).toBe('409 Conflict [Certificate already exists]')
  })

  it('kommt ohne Backend-Meldung aus', () => {
    expect(apiErrorText({ status: 500, statusText: 'Internal Server Error' })).toBe('500 Internal Server Error')
  })

  it('meldet Verbindungsfehler verständlich', () => {
    expect(apiErrorText(new TypeError('Failed to fetch'))).toBe('Keine Verbindung zum Backend: Failed to fetch')
  })
})
