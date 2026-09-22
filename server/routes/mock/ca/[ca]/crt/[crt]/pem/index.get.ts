// GET /mock/ca/:ca/crt/:crt/pem  -> { cert, chain, key, fullchain }
export default defineEventHandler((event) => {
  requireToken(event)
  return mockPem(decodeURIComponent(getRouterParam(event, 'crt')!))
})
