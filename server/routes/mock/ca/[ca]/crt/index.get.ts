/**
 * Mock implementation of the DNS3L `/ca/:ca/crt` endpoint.
 *
 * Returns the certificate list for the requested certificate authority,
 * taken from the caller's own sandbox rather than from a single shared
 * store, so concurrent demo visitors never see each other's data.
 *
 * If no certificates exist for the requested CA, an empty list is returned.
 */
export default defineEventHandler((event) => {
  const crts = crtsFor(event)
  const ca = getRouterParam(event, 'ca')!
  return crts[ca] ?? []
})