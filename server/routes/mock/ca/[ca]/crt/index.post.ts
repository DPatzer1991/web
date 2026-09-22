// POST /mock/ca/:ca/crt  -> Zertifikat "claimen"
export default defineEventHandler(async (event) => {
  requireToken(event)
  const ca = getRouterParam(event, 'ca')!
  const body = await readBody<{ name?: string, wildcard?: boolean }>(event)
  if (!body?.name) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: { message: 'name missing' } })
  }
  const list = (mockCrts[ca] ??= [])
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
