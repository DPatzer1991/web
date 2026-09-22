// Zentraler API-Client für das DNS3L-Backend.
// - Basis-URL aus der Runtime-Config (NUXT_PUBLIC_API_URL)
// - hängt bei angemeldeten Benutzern automatisch den ID-Token an
//   (Authorization: Bearer <id_token>, so erwartet es dns3ld)
// - wirft bei HTTP-Fehlern einen FetchError (status, statusText, data)
//
// Nutzung:  Options API: this.$api('/ca')
//           <script setup> / Composables: useApi()('/ca')
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public

  const api = $fetch.create({
    baseURL: String(config.apiURL),
    onRequest ({ options }) {
      const auth = nuxtApp.$auth
      const token = auth?.loggedIn ? auth.strategy.idToken.get() : null
      if (token) options.headers.set('Authorization', 'Bearer ' + token)
    }
  })

  return { provide: { api } }
})
