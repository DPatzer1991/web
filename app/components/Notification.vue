<template>
  <div class="alert shadow-md mx-4 py-2" :class="alertClass">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>{{ message }}</span>
    <button class="btn btn-square btn-xs btn-ghost" aria-label="Schließen" @click="$emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PageNotification',
  props: {
    message: { type: String, required: true },
    type: { type: String, default: 'warning' }
  },
  emits: ['close'],
  computed: {
    alertClass () {
      return {
        info: 'alert-info',
        warning: 'alert-warning',
        error: 'alert-error'
      }[this.type] ?? 'alert-warning'
    }
  }
}
</script>
