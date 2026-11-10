/**
 * Shared HTTP client for the DNS3L backend, exposed globally as `$api`.
 *
 * Two concerns live here, and only here:
 *
 * 1. WHERE a request goes. Decided per request by apiSource(): the Nitro mock
 *    under /mock, or the real daemon under the configured API URL. Keeping
 *    this in the client means no component, page or composable ever has to
 *    know which environment it is running in - they all just call api('/ca').
 *
 * 2. WHETHER a token is attached. A live request always carries the user's ID
 *    token. A mock request never carries a real one, on purpose: a company
 *    token must not leak to an endpoint that is not the company's backend,
 *    even though both happen to be served from the same origin today.
 *
 * On the synthetic "Bearer mock" header: the mock backend checks for the mere
 * presence of a bearer header on write endpoints (see requireToken in
 * server/utils/mockStore.ts). Sending it only for signed-in users reproduces
 * the real behaviour - a visitor who is not signed in gets a 401 when trying
 * to claim, which is exactly what the UI promises with its "Please log in"
 * hint.
 *
 * Usage:
 *   const api = useApi()
 *   const cas = await api('/ca')
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public

  const api = $fetch.create({
    // Default target. Overridden per request below when the mock answers.
    baseURL: String(config.apiURL),

    onRequest ({ options }) {
      if (apiSource(nuxtApp) === 'mock') {
        options.baseURL = String(config.mockURL)
        if (nuxtApp.$auth?.loggedIn) options.headers.set('Authorization', 'Bearer mock')
        return
      }

      // Live request: dns3ld identifies and authorizes the user by this token.
      const token = nuxtApp.$auth?.strategy.idToken.get()
      if (token) options.headers.set('Authorization', 'Bearer ' + token)
    }
  })

  return { provide: { api } }
})