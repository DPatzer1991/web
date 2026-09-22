import { describe, it, expect, afterEach } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { getRequestHeaders, setResponseStatus } from 'h3'

// Test-Endpunkt, der den empfangenen Authorization-Header zurückgibt
registerEndpoint('/api/whoami', (event) => {
  const h = getRequestHeaders(event) as Record<string, string | undefined>
  return { authorization: h.authorization ?? h.Authorization ?? null }
})
// Test-Endpunkt, der wie dns3ld einen Fehler im JSON-Format liefert
registerEndpoint('/api/broken', (event) => {
  setResponseStatus(event, 404, 'Not Found')
  return { code: 404, message: 'no such CA' }
})

describe('$api', () => {
  afterEach(async () => {
    await useNuxtApp().$auth.logout()
  })

  it('schickt ohne Login keinen Token', async () => {
    const res = await useApi()<{ authorization: string | null }>('/whoami')
    expect(res.authorization).toBeNull()
  })

  it('hängt nach dem Login den ID-Token als Bearer an', async () => {
    await useNuxtApp().$auth.loginWith('dex')
    const res = await useApi()<{ authorization: string | null }>('/whoami')
    expect(res.authorization).toBe('Bearer mock-id-token')
  })

  it('liefert Backend-Fehler so, dass apiErrorText sie lesbar macht', async () => {
    const err = await useApi()('/broken').catch(e => e)
    expect(err.status).toBe(404)
    expect(apiErrorText(err)).toBe('404 Not Found [no such CA]')
  })
})
