<template>
  <section id="problem" class="mx-auto flex max-w-[1280px] flex-col gap-5 px-4 pt-12 sm:px-8">
    <h2 class="text-[clamp(26px,2.8vw,32px)] font-extrabold leading-tight tracking-[-0.02em] text-[#12172B]">
      You need a certificate for your service.
      <span class="text-[#2457C5]">That should not take hours or days.</span>
    </h2>

    <div class="grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-0">

      <!-- Today -->
      <div class="flex flex-col gap-3 rounded-[18px] border border-[#E5E4EC] bg-[#F7F7FA] px-6 py-[22px]">
        <span class="flex flex-wrap items-center justify-between gap-2.5">
          <span class="rounded-full bg-[#F7DDE2] px-2.5 py-[3px] text-xs font-extrabold uppercase tracking-wide text-[#A3122B]">
            Your problem today 😩
          </span>
          <span class="text-[13px] font-bold text-[#A3122B]">⏱ hours to days</span>
        </span>
        <ul class="flex list-none flex-col gap-2 p-0 text-[15px] text-[#3A3F52]">
          <li v-for="t in problems" :key="t" class="flex gap-2.5">
            <span class="font-extrabold text-[#A3122B]">✕</span>{{ t }}
          </li>
        </ul>
      </div>

      <!-- Arrow -->
      <div aria-hidden="true" class="flex justify-center md:px-3">
        <span class="flex size-9 items-center justify-center rounded-full border border-[#C9DAF7] bg-white text-[#2457C5]">
          <UIcon name="i-lucide-arrow-right" class="size-4 max-md:rotate-90" />
        </span>
      </div>

      <!-- With DNS3L -->
      <div class="flex flex-col gap-3 rounded-[18px] border border-[#C9DAF7] bg-gradient-to-b from-[#F5F8FE] to-[#EAF0FD] px-6 py-[22px]">
        <span class="flex flex-wrap items-center justify-between gap-2.5">
          <span class="rounded-full bg-[#1E2A47] px-2.5 py-[3px] text-xs font-extrabold uppercase tracking-wide text-white">
            With DNS3L ⚡
          </span>
          <span class="text-[13px] font-bold text-[#17663A]">⏱ under a minute</span>
        </span>
        <ul class="flex list-none flex-col gap-2 p-0 text-[15px] text-[#2B3044]">
          <li v-for="t in solutions" :key="t" class="flex gap-2.5">
            <span class="font-extrabold text-[#17864A]">✓</span>{{ t }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Compact before/after comparison between today's manual process
 * and DNS3L. Content follows the redesign mockup.
 */
const problems = [
  'Key and CSR with OpenSSL, by hand',
  'Ticket, waiting, certificate by mail',
  'Internal service, but the CA cannot reach it',
  'Expiry in a calendar, renewal at 2 a.m.'
]

const solutions = [
  'One form or one API call, no CSR',
  'Self-service, no ticket, no waiting',
  'DNS-01 + Split DNS: works for internal hosts',
  'Auto-renewal, your app polls one endpoint'
]
</script>