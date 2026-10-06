/**
 * Mock implementation of the DNS3L `DELETE /ca/:ca/crt/:crt` endpoint.
 *
 * Deletes a certificate from the mock certificate store.
 * The request requires authentication and resolves both the selected CA
 * and certificate name from the route parameters.
 *
 * Certificate names are normalized before comparison so names with or
 * without a trailing dot are treated as identical.
 *
 * Returns HTTP 404 if the certificate does not exist.
 */
export default defineEventHandler((event) => {
  requireToken(event)
  const ca = getRouterParam(event, 'ca')!
  const crt = decodeURIComponent(getRouterParam(event, 'crt')!)
  const list = mockCrts[ca] ?? []
  const i = list.findIndex(c => trimDot(c.name) === trimDot(crt))
  if (i < 0) {
    setResponseStatus(event, 404)
    return { code: 404, message: 'Certificate not found' }
  }
  list.splice(i, 1)
  return { code: 200, message: 'deleted' }
})
