// GET /mock/ca/:ca/crt/:crt/pem  -> { cert, chain, key, fullchain }
export default defineEventHandler((event) => {
  return mockPem(decodeURIComponent(getRouterParam(event, 'crt')!))
})
