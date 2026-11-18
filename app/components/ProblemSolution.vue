<template>
  <!-- Step 3 of three, the last one: dark dot, no rail below. -->
  <div class="mx-auto grid max-w-7xl grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-0 px-5.5">

    <div aria-hidden="true" class="flex flex-col items-center">
      <span class="flex size-9 items-center justify-center rounded-full bg-navy-800 text-[15px] font-extrabold text-white shadow-[0_0_0_4px_#E4E7EF]">3</span>
    </div>

    <div class="flex min-w-0 flex-col gap-3">
      <div class="flex flex-col gap-1 pt-1">
        <span class="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#6B7085]">The difference</span>
        <h3 class="m-0 text-[20px] font-extrabold tracking-[-0.02em] text-[#12172B]">
          From hours or days <span class="text-[#2457C5]">to under a minute.</span>
        </h3>
      </div>

      <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-0 max-md:grid-cols-1">
        <div class="flex flex-col gap-2.5 rounded-[18px] border border-[#E5E4EC] bg-[#F7F7FA] px-4 py-3.75">
          <span class="flex items-center justify-between gap-2">
            <span class="rounded-full bg-[#F7DDE2] px-2.5 py-0.75 text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#A3122B]">
              Your problem today 😩
            </span>
            <span class="text-[13px] font-bold text-[#A3122B]">⏱ hours to days</span>
          </span>

          <ul class="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-[#3A3F52]">
            <li v-for="p in problems" :key="p" class="flex gap-2">
              <span aria-hidden="true" class="font-extrabold text-[#A3122B]">✕</span>{{ p }}
            </li>
          </ul>
        </div>

        <!-- Negative margin pulls the circle onto both cards; z-1 keeps it above. -->
        <div
          aria-hidden="true"
          class="relative z-1 -mx-4.5 flex items-center justify-center max-md:mx-0 max-md:-my-4.5"
        >
          <span class="flex size-11 items-center justify-center rounded-full border border-[#C9DAF7] bg-white text-[#2457C5] shadow-[0_10px_24px_-12px_rgba(36,87,197,0.5)] max-md:rotate-90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
            </svg>
          </span>
        </div>

        <div class="flex flex-col gap-2.5 rounded-[18px] border border-[#C9DAF7] bg-[linear-gradient(180deg,#F5F8FE_0%,#EAF0FD_100%)] px-4 py-3.75">
          <span class="flex items-center justify-between gap-2">
            <span class="rounded-full bg-navy-800 px-2.5 py-0.75 text-[12px] font-extrabold uppercase tracking-[0.06em] text-white">
              With DNS3L ⚡
            </span>
            <span class="text-[13px] font-bold text-[#17663A]">⏱ under a minute</span>
          </span>

          <ul class="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-[#2B3044]">
            <li v-for="s in solutions" :key="s" class="flex gap-2">
              <span aria-hidden="true" class="font-extrabold text-[#17864A]">✓</span>{{ s }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Step 3 of three: the comparison that makes the point.
 *
 * Both lists have the same length and matching order, so every line on the
 * left has its answer on the right. Below the md breakpoint the three grid
 * columns become one and the arrow turns a quarter - the mockup is a desktop
 * drawing and does not cover that case.
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