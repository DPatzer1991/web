/**
 * Mock implementation of the DNS3L
 * `GET /ca/:ca/crt/:crt/pem/:type` endpoint.
 *
 * Returns the requested PEM part as a downloadable file.
 * The request requires authentication and resolves the certificate name
 * and PEM type from the route parameters.
 *
 * Supported PEM types are derived from the structure returned by `mockPem()`.
 * Unknown PEM types are rejected with HTTP 404.
 *
 * The response uses PEM-specific download headers so the browser treats
 * the result as a file instead of displaying it as plain text.
 */
export default defineEventHandler((event) => {
  requireToken(event)
  const crt = decodeURIComponent(getRouterParam(event, 'crt')!)
  const type = getRouterParam(event, 'type') as keyof ReturnType<typeof mockPem>
  const pem = mockPem(crt)[type]
  if (!pem) throw createError({ statusCode: 404, statusMessage: 'Unknown PEM type' })
  setHeader(event, 'Content-Type', 'application/x-pem-file')
  setHeader(event, 'Content-Disposition', `attachment; filename="${trimDot(crt)}.${type}.pem"`)
  return pem
})
