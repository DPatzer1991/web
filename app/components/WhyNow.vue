<template>
  <!-- Step 2 of three. Continues the rail from MtlsExplainer, so no padding
       above and none below beyond the step's own 34px. -->
  <div class="mx-auto grid max-w-7xl grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-0 px-5.5">

    <div aria-hidden="true" class="flex flex-col items-center">
      <span class="flex size-9 items-center justify-center rounded-full bg-[#2457C5] text-[15px] font-extrabold text-white shadow-[0_0_0_4px_#DCE6FB]">2</span>
      <span class="mt-2 w-0.5 flex-1 rounded-[2px] bg-[#DCE6FB]" />
    </div>

    <div class="flex min-w-0 flex-col gap-3 pb-8.5">
      <div class="flex flex-col gap-1 pt-1">
        <span class="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#6B7085]">Why now</span>
        <h3 class="m-0 text-[20px] font-extrabold tracking-[-0.02em] text-[#12172B]">
          More certificates, shorter lifetimes.
          <span class="text-[#2457C5]">By hand, this stops working.</span>
        </h3>
      </div>

      <ul
        aria-label="Why now"
        class="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-2.75 p-0"
      >
        <li
          v-for="f in facts"
          :key="f.title"
          class="flex flex-col gap-2 rounded-[18px] border border-[#E6EAF2] bg-white p-3.5"
        >
          <span
            aria-hidden="true"
            class="flex size-9 items-center justify-center rounded-[12px]"
            :class="f.tile"
          >
            <!-- Icon markup is a constant in this file, not user input. -->
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              v-html="icons[f.icon]"
            />
          </span>

          <strong class="text-[15px] tracking-[-0.02em] text-[#12172B]">{{ f.title }}</strong>
          <span class="text-[14px] leading-normal text-[#4B5063]">{{ f.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Step 2 of three: why the manual way is running out of road.
 *
 * Four short statements rather than paragraphs - the detail belongs to step 1
 * and step 3. The 47-day figure refers to the CA/Browser Forum decision to
 * shorten the maximum lifetime of publicly trusted certificates until 2029.
 */
const icons: Record<string, string> = {
  clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
  alert: '<path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path>',
  link: '<circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="12" r="3"></circle><path d="M9 12h6"></path>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path><path d="m9 15 2 2 4-4"></path>'
}

const facts = [
  {
    icon: 'clock',
    title: 'Certificates expire faster',
    text: '47 days from 2029.',
    tile: 'bg-[#E6EEFC] text-[#2457C5]'
  },
  {
    icon: 'alert',
    title: 'Expired means outage',
    text: 'Clients refuse the connection.',
    tile: 'bg-[#FDE7F2] text-[#C2006A]'
  },
  {
    icon: 'link',
    title: 'One certificate per service',
    text: 'mTLS from step 1, for every service.',
    tile: 'bg-[#E4E7EF] text-[#1E2A47]'
  },
  {
    icon: 'doc',
    title: 'Audits flag manual work',
    text: 'Self-signed and hand-copied keys.',
    tile: 'bg-[#E6EEFC] text-[#2457C5]'
  }
]
</script>