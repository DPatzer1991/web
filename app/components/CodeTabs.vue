<template>
  <div class="overflow-hidden rounded-[12px] bg-[#111726]">
    <!-- Title bar: window dots, one tab per variant, copy button -->
    <div class="flex items-center gap-3 border-b border-white/10 px-3 py-2">
      <div aria-hidden="true" class="flex gap-1.5">
        <span class="size-2.5 rounded-full bg-[#FF5F57]" />
        <span class="size-2.5 rounded-full bg-[#FEBC2E]" />
        <span class="size-2.5 rounded-full bg-[#28C840]" />
      </div>

      <div class="ml-2 flex gap-1">
        <button
          v-for="(t, i) in tabs"
          :key="t.label"
          type="button"
          class="rounded-[7px] px-2.5 py-1 text-[11.5px] font-bold transition-colors"
          :class="i === active ? 'bg-white/15 text-white' : 'text-[#9FB2D8] hover:text-white'"
          :aria-pressed="i === active"
          @click="active = i"
        >
          {{ t.label }}
        </button>
      </div>

      <button
        type="button"
        class="ml-auto flex items-center gap-1.5 rounded-[7px] border border-white/15 px-2.5 py-1 text-[11.5px] font-bold text-[#9FB2D8] hover:text-white"
        @click="copy"
      >
        <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3" />
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>

    <!-- The snippet itself. pre keeps the line breaks the snippet was written with. -->
    <pre class="overflow-x-auto px-4 py-3 font-mono text-[11.5px] leading-relaxed text-[#D6DEF0]"><code>{{ current }}</code></pre>
  </div>
</template>

<script setup lang="ts">
/**
 * A small code panel with one tab per variant and a copy button.
 *
 * Used by the "How to use your certificate" guide, where every step exists
 * both as a raw HTTP call and as a dns3lcli command. Keeping the two side by
 * side rather than in separate sections means the reader can switch without
 * losing their place.
 */
const props = defineProps<{
  tabs: { label: string, code: string }[]
}>()

const active = ref(0)
const current = computed(() => props.tabs[active.value]?.code ?? '')

const copied = ref(false)

/**
 * Copy the visible snippet. The clipboard API is unavailable in insecure
 * contexts, so a failure is swallowed - the text stays selectable by hand.
 */
async function copy() {
  try {
    await navigator.clipboard.writeText(current.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1300)
  } catch {
    // ignored on purpose
  }
}
</script>