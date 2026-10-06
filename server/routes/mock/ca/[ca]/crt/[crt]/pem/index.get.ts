/**
 * Mock implementation of the DNS3L
 * `GET /ca/:ca/crt/:crt/pem` endpoint.
 *
 * Returns all PEM parts for the requested certificate:
 * certificate, chain, private key and fullchain.
 *
 * The request requires authentication. The certificate name is read
 * from the route parameter, URL-decoded and passed to `mockPem()`,
 * which generates the mock PEM response.
 */
export default defineEventHandler((event) => {
  requireToken(event)
  return mockPem(decodeURIComponent(getRouterParam(event, 'crt')!))
})
