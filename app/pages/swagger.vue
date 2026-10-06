<template>
  <div class="flex h-full py-0.5">
    <p v-if="error" class="m-8 text-error">
      API-Viewer couldn't be loaded: {{ error }}
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
/**
 * Public API documentation page based on RapiDoc.
 *
 * RapiDoc is bundled with the application through the npm package
 * instead of being loaded from an external CDN at runtime.
 *
 * The OpenAPI specification is loaded from the configured `specURL`.
 * By default, this can point to a locally hosted file such as
 * `public/openapi.yaml`, while other environments may override the
 * source through runtime configuration.
 */
definePageMeta({ auth: false })

/**
 * URL of the OpenAPI specification used by the RapiDoc viewer.
 * The value is provided through Nuxt runtime configuration.
 */
const specUrl = useRuntimeConfig().public.specURL
const error = ref(null)

/**
 * Load RapiDoc only in the browser.
 *
 * Importing the package registers the custom `<rapi-doc>` web component.
 * The dynamic import inside `onMounted()` avoids loading browser-specific
 * web-component code during server-side rendering.
 */
onMounted(async () => {
  try {
    await import('rapidoc') // registriert das Web Component <rapi-doc>
  } catch (e) {
    console.error('[swagger] RapiDoc couldn\'t be loaded', e)
    error.value = String(e)
  }
})
</script>
