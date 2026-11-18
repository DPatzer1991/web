<template>
  <div aria-hidden="true" class="relative select-none">
    <!-- Paint stain behind the window -->
    <div class="absolute -right-12 -top-20 size-72 rounded-full bg-[#A9C2F0] opacity-50 blur-3xl" />

    <!-- ── Window: Certificate List ───────────────── -->
    <div class="relative overflow-hidden rounded-[18px] bg-white shadow-[0_30px_60px_-30px_rgba(30,42,71,0.45)]">
      <div class="flex items-center gap-3 bg-[#F4F3F7] px-3.5 py-2.5">
        <div class="flex gap-1.5">
          <span class="size-2.5 rounded-full bg-[#FF5F57]" />
          <span class="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span class="size-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span class="mx-auto max-w-75 flex-1 truncate rounded-lg border border-[#E5E3EC] bg-white px-3 py-1 text-center font-mono text-[11.5px] text-[#4B5063]">
          dns3l.example.com/ca/letsencrypt
        </span>
        <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#17864A]">
          <span class="size-2 rounded-full bg-[#22C55E]" /> Live
        </span>
      </div>

      <!-- CA-Head -->
      <div class="flex items-center justify-between gap-3.5 px-5 pb-3 pt-4">
        <div class="flex items-center gap-2.5">
          <img src="/le.png" alt="" class="size-9 rounded-[10px] object-contain">
          <span class="flex flex-col">
            <span class="text-[15px] font-extrabold text-[#12172B]">Let's Encrypt</span>
            <span class="text-[11.5px] text-[#4B5063]">{{ rows.length }} certificates</span>
          </span>
        </div>
        <span class="rounded-[10px] bg-brand-500 px-3 py-2 text-xs font-bold text-white">
          + New certificate
        </span>
      </div>

      <!-- Search -->
      <div class="px-4 pb-2">
        <span class="flex items-center gap-2 rounded-[9px] border border-[#E5E3EC] px-2.5 py-1.75 text-[12px] text-[#8A90A3]">
          <UIcon name="i-lucide-search" class="size-3.5" /> Search by certificate name
        </span>
      </div>

      <!-- Rows -->
      <div class="px-3 pb-4">
        <div
          v-for="row in rows"
          :key="row.name"
          class="grid grid-cols-[minmax(0,1fr)_118px_40px] items-center gap-3 rounded-[10px] border-t border-[#F1EFF4] px-3 py-2.5"
        >
          <span class="flex min-w-0 items-center gap-1.5">
            <span class="truncate font-mono text-[12.5px] font-medium text-[#12172B]">{{ row.name }}</span>
            <span
              v-if="row.wildcard"
              class="shrink-0 rounded-full bg-[#DCEBFB] px-1.5 py-px text-[10px] font-bold text-[#1D4F8A]"
            >Wildcard</span>
          </span>

          <span class="flex flex-col gap-1">
            <span class="flex items-center justify-between text-[11px] font-bold">
              <span class="text-[#4B5063]">{{ row.days }}</span>
              <span :class="row.text">{{ row.state }}</span>
            </span>
            <span class="h-1 w-full rounded-full bg-[#ECEFF6]">
              <span class="block h-1 rounded-full" :class="row.bar" :style="{ width: row.pct }" />
            </span>
          </span>

          <span class="flex justify-end text-[#9AA0B2]">
            <UIcon name="i-lucide-trash-2" class="size-3.5" />
          </span>
        </div>
      </div>
    </div>

    <!-- Status -->
    <div class="relative -mt-3 ml-4 inline-flex items-center gap-2.5 rounded-[14px] bg-navy-800 px-3.5 py-2.5 text-[13px] text-white shadow-lg">
      <UIcon name="i-lucide-circle-check" class="size-4 text-[#22C55E]" />
      Manage all your certificates 👍
    </div>

    <!-- ── Window: Delivery ───────────────────── -->
    <div class="relative mt-3 flex items-stretch gap-0">
      <div class="flex-1 overflow-hidden rounded-[14px] bg-white shadow-[0_20px_40px_-24px_rgba(30,42,71,0.4)]">
        <div class="flex gap-1.5 bg-[#2A3250] px-3.5 py-2.5">
          <span class="size-2 rounded-full bg-[#C8CCDA]" />
          <span class="size-2 rounded-full bg-[#C8CCDA]" />
          <span class="size-2 rounded-full bg-[#C8CCDA]" />
        </div>
        <div class="flex items-center gap-5 p-6">
          <span class="relative rounded-xl bg-white px-4.5 py-5 text-lg font-extrabold text-[#12172B] shadow-[0_8px_24px_-12px_rgba(30,42,71,0.5)]">
            X.509
            <span class="absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full bg-navy-800">
              <UIcon name="i-lucide-check" class="size-3.5 text-white" />
            </span>
          </span>
          <span class="flex flex-1 flex-col gap-2.5">
            <span class="h-2.5 w-full rounded-full bg-[#E6E2EA]" />
            <span class="h-2.5 w-4/5 rounded-full bg-[#E6E2EA]" />
            <span class="h-2.5 w-2/3 rounded-full bg-[#E6E2EA]" />
          </span>
        </div>
      </div>

      <div class="flex w-14 flex-col justify-around py-2">
        <span v-for="n in 3" :key="n" class="flex items-center gap-0.5">
          <span class="h-0 flex-1 border-t-2 border-dashed border-[#9DB6E8]" />
          <UIcon name="i-lucide-chevron-right" class="size-3 shrink-0 text-[#9DB6E8]" />
        </span>
      </div>

      <div class="flex w-37.5 flex-col justify-around gap-2.5">
        <span class="flex items-center gap-3 rounded-xl border border-[#E6E1EC] bg-white px-4 py-3 text-[13px] font-medium text-[#12172B]">
          <UIcon name="i-lucide-box" class="size-4 text-[#4B5063]" /> Your App
        </span>
        <span class="flex items-center gap-3 rounded-xl border border-[#E6E1EC] bg-white px-4 py-3 text-[13px] font-medium text-[#12172B]">
          <span class="text-[15px] font-extrabold text-[#2457C5]">3L</span> DNS3L
        </span>
        <span class="flex items-center gap-3 rounded-xl border border-[#E6E1EC] bg-white px-4 py-3 text-[13px] font-medium text-[#12172B]">
          <UIcon name="i-lucide-shield" class="size-4 text-[#4B5063]" /> CA / ACME
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Static simulation of the surface for the Hero..
 */
const rows = [
  { name: 'app.example.com', days: '80 days', state: 'Valid', pct: '89%', text: 'text-[#17864A]', bar: 'bg-[#2457C5]' },
  { name: 'api.example.com', days: '30 days', state: 'Due', pct: '33%', text: 'text-[#B45309]', bar: 'bg-[#D97706]' },
  { name: '*.example.com', wildcard: true, days: '5 days', state: 'Critical', pct: '6%', text: 'text-[#A3122B]', bar: 'bg-[#A3122B]' }
]
</script>