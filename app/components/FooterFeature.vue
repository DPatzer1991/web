<template>
  <div class="flex items-start gap-3">
    <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E6EEFC] text-[#2457C5]">
      <UIcon :name="icon" class="size-5" />
    </span>
    <span class="flex flex-col leading-tight">
      <span class="text-sm font-bold text-[#12172B]">{{ title }}</span>
      <span class="text-xs text-[#4B5063]">{{ subtitle }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
/**
* Small feature tile in the footer: colored icon square,
* next to it two lines of text.
 */
defineProps<{
  icon: string
  title: string
  subtitle: string
}>()
</script>