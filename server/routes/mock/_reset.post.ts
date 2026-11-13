/**
 * Mock-only endpoint used to reset the caller's own local DNS3L test data.
 *
 * This is intended for automated tests and local development so each
 * test can start from a clean and predictable mock state. Only the sandbox
 * belonging to the X-Demo-Session header is reset - other visitors are
 * untouched, which is what makes the endpoint safe on a shared demo.
 *
 * The endpoint must not be exposed in production.
 */
export default defineEventHandler((event) => {
  resetMock(event)
  return { reset: true }
})