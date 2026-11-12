<template>
  <div class="flex flex-col gap-3.5">
    <span class="text-xs font-bold uppercase tracking-wide text-[#3A3F52]">
      {{ title }}
    </span>

    <template v-for="link in links" :key="link.label">
      <a
        v-if="link.external"
        :href="link.to"
        target="_blank"
        rel="noopener"
        class="text-[15px] text-[#2B3044] transition-colors hover:text-brand-500"
      >{{ link.label }}</a>
      <NuxtLink
        v-else
        :to="link.to"
        class="text-[15px] text-[#2B3044] transition-colors hover:text-brand-500"
      >{{ link.label }}</NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
export interface FooterLink {
  label: string
  to: string
  /** true = externe Seite, öffnet in neuem Tab */
  external?: boolean
}

defineProps<{
  title: string
  links: FooterLink[]
}>()
</script>