/**
 * Shared HTTP client for the DNS3L backend.
 *
 * The client:
 * - uses the API base URL from Nuxt runtime configuration
 * - automatically adds the authenticated user's ID token
 *   as a Bearer token to backend requests
 * - is exposed globally as `$api`
 *
 * This keeps backend URL and authentication handling in one place,
 * so components and composables only need to specify the API endpoint.
 *
 * Usage:
 *   const api = useApi()
 *   const cas = await api('/ca')
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public

  const api = $fetch.create({
     // Prefix all relative API paths with the configured DNS3L backend URL.
    baseURL: String(config.apiURL),
    /**
     * Runs before every request.
     * Authenticated requests receive the current ID token so dns3ld
     * can identify and authorize the user.
     */
    onRequest ({ options }) {
      const auth = nuxtApp.$auth
      const token = auth?.loggedIn ? auth.strategy.idToken.get() : null
      if (token) options.headers.set('Authorization', 'Bearer ' + token)
    }
  })
  
   // Expose the configured client globally as `nuxtApp.$api`.
  return { provide: { api } }
})
