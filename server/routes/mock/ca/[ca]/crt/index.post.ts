/**
 * Mock implementation of the DNS3L `POST /ca/:ca/crt` endpoint.
 *
 * Simulates claiming a new certificate from the selected certificate authority.
 * The request requires authentication and must contain a certificate name.
 * The certificate is written to the caller's own sandbox, selected by the
 * X-Demo-Session header.
 *
 * Existing certificate names are rejected with HTTP 409, and a visitor who
 * has filled their sandbox with HTTP 429 - the mock holds its data in memory,
 * so an unbounded number of claims would be a way to exhaust the server.
 * A short delay simulates the processing time of a real certificate authority
 * before the generated mock certificate is stored and returned with HTTP 201.
 */
export default defineEventHandler(async (event) => {
  requireToken(event)
  const crts = crtsFor(event)
  const ca = getRouterParam(event, 'ca')!
  const body = await readBody<{ name?: string, wildcard?: boolean }>(event)
  if (!body?.name) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: { message: 'name missing' } })
  }
  if (atClaimLimit(crts)) {
    setResponseStatus(event, 429)
    return { code: 429, message: 'Demo limit reached' }
  }
  const list = (crts[ca] ??= [])
  if (list.some(c => trimDot(c.name) === trimDot(body.name!))) {
    setResponseStatus(event, 409)
    return { code: 409, message: 'Certificate already exists' }
  }
  await new Promise(r => setTimeout(r, 1500)) // Wartezeit wie bei echter CA
  const crt = mockCrt(body.name, !!body.wildcard, 0, 90)
  list.push(crt)
  setResponseStatus(event, 201)
  return crt
})