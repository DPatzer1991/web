<template>
  <div class="flex h-full py-0.5">
    <p v-if="error" class="m-8 text-error">
      API-Viewer konnte nicht geladen werden: {{ error }}
    </p>
    <rapi-doc
      v-else
      id="apiviewer"
      class="flex-1"
      :spec-url="specUrl"
      show-header="false"
      load-fonts="false"
      render-style="read"
      theme="light"
      font-size="large"
      primary-color="#e20074"
      nav-accent-color="#e20074"
      nav-bg-color="#4B5563"
      nav-text-color="#F8FAFC"
      default-schema-tab="schema"
      schema-hide-read-only="never"
      schema-hide-write-only="never"
      show-components="true"
      use-path-in-nav-bar="false"
      show-method-in-nav-bar="as-colored-block"
      regular-font="Open Sans, ui-sans-serif, system-ui, sans-serif"
      mono-font="Roboto Mono, ui-monospace, monospace"
    />
  </div>
</template>

<script setup>
// API-Dokumentation mit RapiDoc – ohne externe Abhängigkeiten zur Laufzeit:
// - der Viewer kommt als npm-Paket "rapidoc" aus dem eigenen Build (statt unpkg.com)
// - die API-Beschreibung liegt unter public/openapi.yaml (statt raw.githubusercontent.com)
// Andere Quelle per NUXT_PUBLIC_SPEC_URL möglich.
definePageMeta({ auth: false })

const specUrl = useRuntimeConfig().public.specURL
const error = ref(null)

onMounted(async () => {
  try {
    await import('rapidoc') // registriert das Web Component <rapi-doc>
  } catch (e) {
    console.error('[swagger] RapiDoc konnte nicht geladen werden', e)
    error.value = String(e)
  }
})
</script>
