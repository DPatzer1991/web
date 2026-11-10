<template>
 <!-- Public application start page.
    The actual page content is implemented inside the Home component. -->
  <Home />
</template>

<script>
export default {
  // Component name used for debugging and Vue DevTools.
  name: 'IndexPage'
}
</script>

/**
 * The start page is publicly accessible.
 *
 * Authentication is not required here because unauthenticated users
 * may be redirected to this page to start the login flow.
 */
<script setup>
definePageMeta({ auth: false })
</script>
