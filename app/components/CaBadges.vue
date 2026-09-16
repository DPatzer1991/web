<template>
  <span class="whitespace-normal">
    <span v-if="type === 'public'" class="badge badge-sm badge-warning">{{ type }}</span>
    <span v-else-if="type === 'private'" class="badge badge-sm badge-info text-slate-50">{{ type }}</span>
    <span v-else class="badge badge-sm badge-error">unknown</span>
    <span v-if="acme" class="badge badge-sm badge-success">ACME</span>
    <span v-if="count" class="badge badge-sm">{{ count }}</span>

  </span>
</template>

<script>
export default {
  name: 'CaBadges',
  props: ['type', 'acme', 'count']
}
</script>
