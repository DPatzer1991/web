// DELETE /mock/ca/:ca/crt/:crt
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
