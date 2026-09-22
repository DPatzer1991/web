// GET /mock/ca/:ca/crt/:crt/pem/:type  -> PEM als Datei
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
