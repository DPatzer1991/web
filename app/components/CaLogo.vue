<template>
  <span
    class="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#ECE7EE] bg-white"
    :class="sizeClass"
  >
    <img v-if="current" :src="current" alt="" class="size-[70%] object-contain" @error="next">
    <span v-else class="text-[11px] font-bold text-[#4B5063]">{{ initials }}</span>
  </span>
</template>

<script setup lang="ts">
/**
 * Logo of a certificate authority.
 *
 * Where logos come from
 * ---------------------
 * There is no mapping table from CA to image anywhere in this project, by
 * design. The daemon reports a `logo` path per CA, configured by the operator
 * as `logopath` in the CA provider section of config.yaml. It may be an
 * absolute URL, or a path that the browser resolves against the web UI's own
 * origin - in the latter case the file has to live in this app's public/
 * folder.
 *
 * Why there is a fallback chain
 * -----------------------------
 * An installation may have no logopath configured, or point at a file nobody
 * copied into the image. A broken <img> in the middle of a card looks like a
 * bug, so every failed load advances to the next candidate:
 *
 *   1. the path reported by the API
 *   2. public/ca-logos/<id>.png   - convention letting an operator add logos
 *   3. public/ca-logos/<id>.svg     without touching the daemon config
 *   4. the CA's initials
 *
 * The alt attribute is intentionally empty: the CA name sits right next to the
 * logo, so announcing it twice only adds noise for screen reader users.
 */
const props = withDefaults(defineProps<{
  id: string
  name: string
  /** Logo path as delivered by the API; absolute URL or path. */
  logo?: string
  size?: 'sm' | 'md'
}>(), { size: 'md' })

const candidates = computed(() => [
  props.logo,
  `/ca-logos/${props.id}.png`,
  `/ca-logos/${props.id}.svg`
].filter(Boolean) as string[])

const index = ref(0)
const current = computed(() => candidates.value[index.value] ?? '')

/** Advance to the next candidate when the current image fails to load. */
const next = () => { index.value++ }

// A different CA means different files, so the chain starts over. Relevant
// because Vue reuses this component instance when a list is re-rendered.
watch(() => props.id, () => { index.value = 0 })

const initials = computed(() =>
  props.name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
)

const sizeClass = computed(() => (props.size === 'sm' ? 'size-9' : 'size-11'))
</script>