/**
 * Mock-only endpoint used to reset all local DNS3L test data.
 *
 * This is intended for automated tests and local development so each
 * test can start from a clean and predictable mock state.
 *
 * The endpoint must not be exposed in production.
 */
export default defineEventHandler(() => {
  resetMock()
  return { reset: true }
})
