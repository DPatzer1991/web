<template>
  <div class="flex justify-center m-8">
    <div class="card bg-base-100 shadow-xl w-full max-w-lg">
      <div class="card-body">
        <p v-if="!error">Anmeldung wird abgeschlossen…</p>
        <template v-else>
          <h2 class="card-title text-error">Anmeldung fehlgeschlagen</h2>
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
// Callback-URL für Dex (redirect_uri = <origin>/login, wie bisher bei auth-next)
definePageMeta({ auth: false })

const { $auth } = useNuxtApp()
const route = useRoute()
const error = ref<string | null>(null)

onMounted(async () => {
  if (route.query.error) {
    error.value = `${route.query.error}: ${route.query.error_description ?? ''}`
    return
  }
  if (!route.query.code) {
    await navigateTo('/')
    return
  }
  try {
    const target = await $auth.handleCallback()
    await navigateTo(target, { replace: true })
  } catch (e) {
    console.error('[auth] Callback fehlgeschlagen', e)
    error.value = String(e)
  }
})
</script>
