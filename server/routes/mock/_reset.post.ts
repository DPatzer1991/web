// POST /mock/_reset  -> Mock-Daten zurücksetzen (nur für Tests)
export default defineEventHandler(() => {
  resetMock()
  return { reset: true }
})
