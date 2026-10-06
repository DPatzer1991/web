/**
 * Mock implementation of the DNS3L `/ca/:ca/crt` endpoint.
 *
 * Returns the certificate list for the requested certificate authority.
 * The CA identifier is read from the route parameter and used to select
 * the corresponding mock certificate collection.
 *
 * If no certificates exist for the requested CA, an empty list is returned.
 */
export default defineEventHandler((event) => {
  const ca = getRouterParam(event, 'ca')!
  return mockCrts[ca] ?? []
})
