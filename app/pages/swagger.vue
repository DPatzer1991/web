<template>
  <!--
  https://vueschool.io/articles/vuejs-tutorials/how-to-load-third-party-scripts-in-nuxt-js/
  https://deltener.com/blog/nuxt-third-party-code-is-poison/
  https://javascript.info/script-async-defer
  -->
  <div class="flex h-full py-0.5">
    <rapi-doc
      id="apiviewer"
      class="flex-1"
      spec-url="https://raw.githubusercontent.com/dns3l/dns3l/master/openapi.yaml"
      show-header="false"
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
      regular-font="Open Sans"
      mono-font="Roboto Mono"
    />
  </div>
</template>

<script>
export default {
  name: 'ViewAPI',
  auth: false,
  setup () {
    // Nuxt 4: head() gibt es nicht mehr -> useHead
    useHead({
      script: [
        { src: 'https://unpkg.com/rapidoc/dist/rapidoc-min.js', type: 'module', defer: true }
      ]
    })
  }
}
</script>
