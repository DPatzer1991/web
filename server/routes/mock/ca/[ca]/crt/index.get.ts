// GET /mock/ca/:ca/crt  -> Zertifikatsliste
export default defineEventHandler((event) => {
  const ca = getRouterParam(event, 'ca')!
  return mockCrts[ca] ?? []
})
