/**
 * Shared HTTP client for the DNS3L backend, exposed globally as `$api`.
 *
 * Two concerns live here, and only here: which backend answers, and whether a
 * token is attached. Components and composables never need to know which
 * environment they run in.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public

  const api = $fetch.create({
    baseURL: String(config.apiURL),

    onRequest ({ options }) {
      if (apiSource(nuxtApp) === 'mock') {
        options.baseURL = String(config.mockURL)
        // The mock only checks that a bearer header exists. Demo visitors get
        // a synthetic one so they can claim and delete; a real company token
        options.headers.set('X-Demo-Session', demoSessionId())
        // is never sent here.
        if (isDemo() || nuxtApp.$auth?.loggedIn) {
          options.headers.set('Authorization', 'Bearer demo')
        }
        return
      }

      // Live request: dns3ld identifies and authorizes the user by this token.
      const token = nuxtApp.$auth?.strategy.idToken.get()
      if (token) options.headers.set('Authorization', 'Bearer ' + token)
    }
  })

  return { provide: { api } }
})