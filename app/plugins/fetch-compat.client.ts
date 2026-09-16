// TEMPORÄR: bildet den Nuxt-2-Hook `async fetch()` + `$fetchState` + `$fetch()` nach.
// Wird in Schritt 3 durch useAsyncData/$fetch ersetzt und dann gelöscht.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    created () {
      const fetchFn = this.$options.fetch
      if (typeof fetchFn !== 'function') return

      const state = reactive({ pending: true, error: null as unknown, timestamp: 0 })
      this.$fetchState = state
      this.$fetch = async () => {
        state.pending = true
        state.error = null
        try {
          await fetchFn.call(this)
        } catch (e) {
          state.error = e
          console.error('[fetch-compat]', e)
        } finally {
          state.pending = false
          state.timestamp = Date.now()
        }
      }
      this.$fetch()
    }
  })
})
