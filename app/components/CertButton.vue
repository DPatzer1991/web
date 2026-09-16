<template>
  <button :disabled="(! $auth.loggedIn) || loading" class="btn btn-primary normal-case text-slate-50 text-l" @click="$emit('claim-cert')">
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'CertButton',
  props: {
    label: {
      type: String,
      default () { return 'Get Your Certificate' }
    },
    loading: {
      type: Boolean,
      default () { return false }
    }
  }
}
</script>
