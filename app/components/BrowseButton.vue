<template>
  <NuxtLink :to="'/browse/' + ca.id.toLowerCase()" :disabled="! $auth.loggedIn || ! ca.enabled" class="btn btn-sm btn-primary normal-case text-slate-50">
    {{ label }}
  </NuxtLink>
</template>

<script>
export default {
  name: 'BrowseButton',
  props: {
    label: {
      type: String,
      default () { return 'Browse...' }
    },
    ca: {
      type: Object,
      default () { return {} }
    }
  }
}
</script>
