<template>
  <div class="card card-side card-compact items-center bg-base-100 shadow-xl">
    <figure class="h-fit ml-4">
      <div class="avatar placeholder" :class="{ online: ca.enabled, offline: !ca.enabled }">
        <div v-if="ca.logo" :class="{ 'border-2': ca.enabled, 'border-success': ca.enabled }" class="w-16 rounded-full border border-1 bg-slate-100 p-2">
          <img :src="ca.logo" />
        </div>
        <div v-else class="bg-neutral-focus text-neutral-content rounded-full w-16">
          <span class="text-xl">{{ ca.id }}</span>
        </div>
      </div>
    </figure>
    <div class="card-body gap-0">
      <progress v-if="ca.totalValid && ca.totalIssued" class="progress progress-success" :value="ca.totalValid" :max="ca.totalIssued" />
      <p class="card-title">
        <a v-if="ca.url" class="whitespace-nowrap" :href="ca.url" target="_blank">{{ ca.name }}</a>
        <span v-else class="whitespace-nowrap">{{ ca.name }}</span>
        <CaBadges :type="ca.type" :acme="ca.acme" />
      </p>
      <p v-if="ca.desc">
        {{ ca.desc }}
      </p>
      <div class="card-actions justify-end mt-3">
        <a v-if="ca.roots" :href="ca.roots" target="_blank" class="btn btn-sm btn-primary normal-case text-slate-50">Roots</a>
        <BrowseButton :ca="ca" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaCard',
  props: {
    ca: {
      type: Object,
      default () { return {} }
    }
  }
}
</script>
