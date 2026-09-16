<template>
  <div class="alert" :class="{ 'alert-warning': alert }">
    <div>
      <svg v-if="alert" xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div>
        <h3 class="font-bold">{{ title }}</h3>
        <div class="text-xs">
          <slot>
            A notification box providing a <code>slot</code> for the message and <code>[title, spinner, closable, alert]</code> props
          </slot>
        </div>
      </div>
    </div>
    <div class="flex-none">
      <button v-if="spinner" class="btn btn-square btn-ghost loading"></button>
      <button v-if="closable" class="btn btn-square btn-xs btn-ghost" @click="$emit('info-message-closed')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoMessage',
  props: {
    title: {
      type: String,
      default () { return 'Hello world.' }
    },
    alert: {
      type: Boolean,
      default () { return false }
    },
    spinner: {
      type: Boolean,
      default () { return false }
    },
    closable: {
      type: Boolean,
      default () { return false }
    }
  }
}
</script>
