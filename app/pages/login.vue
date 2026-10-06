<template>
  <div class="flex justify-center m-8">
    <div class="card bg-base-100 shadow-xl w-full max-w-lg">
      <div class="card-body">

        <!-- Default state while the authorization code is being processed. -->
        <p v-if="!error">Login is being completed…</p>
        <!-- Show authentication errors returned by Dex or the callback handler. -->
        <template v-else>
          <h2 class="card-title text-error">Login failed</h2>
          <p><code>{{ error }}</code></p>
          <div class="card-actions justify-end">
            <NuxtLink to="/" class="btn btn-primary normal-case text-slate-50">Zur Startseite</NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * OIDC callback page used by Dex after authentication.
 *
 * Dex redirects the browser back to:
 *   <origin>/login?code=...
 *
 * This page completes the authentication flow by passing the
 * authorization code to the shared auth client.
 *
 * The route must remain public because the user is not authenticated
 * until the callback has been processed successfully.
 */
definePageMeta({ auth: false })

const { $auth } = useNuxtApp()
const route = useRoute()
// Contains an authentication error that should be shown to the user.
const error = ref<string | null>(null)

onMounted(async () => {

  /**
   * Dex may redirect back with an OAuth/OIDC error instead of an
   * authorization code, for example when authentication was cancelled
   * or rejected.
   */
  if (route.query.error) {
    error.value = `${route.query.error}: ${route.query.error_description ?? ''}`
    return
  }

  /**
   * A successful OIDC callback must contain an authorization code.
   * Without it there is nothing to exchange for tokens, so return
   * to the application's start page.
   */
  if (!route.query.code) {
    await navigateTo('/')
    return
  }
  try {
   /**
     * Complete the OIDC authorization-code flow.
     *
     * handleCallback() validates/processes the callback and returns
     * the route the user originally requested before authentication.
     */
    const target = await $auth.handleCallback()
   /**
     * Continue to the originally requested page.
     *
     * `replace: true` removes the callback URL containing `?code=...`
     * from the browser history.
     */
    await navigateTo(target, { replace: true })
  } catch (e) {
    // Keep the user on the callback page and expose the failure state.
    console.error('[auth] Callback failed', e)
    error.value = String(e)
  }
})
</script>
