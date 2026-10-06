<template>
  <CaTable class="max-w-fit h-fit mx-auto my-8"/>
</template>

<script>
export default {
  name: 'BrowseCAs',
}
</script>

<script setup>
/**
 * Allow access to the CA overview without authentication.
 *
 * The global authentication middleware skips routes
 * explicitly marked with `auth: false`.
 */
definePageMeta({ auth: false })
</script>
