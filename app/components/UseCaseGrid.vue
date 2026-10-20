<template>
  <section id="use-cases" class="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-16 sm:px-8">

    <!-- Heading -->
    <div class="flex flex-col gap-2">
      <span class="text-xs font-bold uppercase tracking-wide text-[#2457C5]">
        Who it's for 🎯
      </span>
      <h2 class="text-[clamp(26px,2.8vw,34px)] font-extrabold leading-tight tracking-[-0.02em] text-[#12172B]">
        Wherever your services talk TLS.
      </h2>
    </div>

    <!-- Four audience cards -->
    <ul class="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 xl:grid-cols-4">
      <li
        v-for="c in cases"
        :key="c.title"
        class="flex flex-col gap-3.5 rounded-[18px] border border-[#ECE7EE] bg-white px-6 py-6 transition-shadow hover:shadow-[0_18px_36px_-28px_rgba(18,23,43,0.45)]"
      >
        <!-- Pastel icon tile, one accent per card -->
        <span
          class="flex size-11 items-center justify-center rounded-[13px]"
          :class="c.tile"
        >
          <UIcon :name="c.icon" class="size-5" :class="c.iconColor" />
        </span>

        <h3 class="text-[17px] font-extrabold tracking-[-0.01em] text-[#12172B]">
          {{ c.title }}
        </h3>
        <p class="text-[14.5px] leading-snug" :class="c.textColor">
          {{ c.text }}
        </p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
/**
 * "Who it's for" – four short audience cards.
 *
 * Purely static content: no API call, no state. Each card carries its own
 * accent colour so the row stays readable without a legend. The icons come
 * from the locally installed @iconify-json/lucide package, so nothing is
 * fetched from the Iconify API at runtime (air-gap requirement).
 */
const cases = [
  {
    title: 'Web applications',
    text: 'Trusted TLS for public-facing web apps and portals.',
    icon: 'i-lucide-globe',
    tile: 'bg-[#E6EEFC]',
    iconColor: 'text-[#2457C5]',
    textColor: 'text-[#12172B]'
  },
  {
    title: 'Internal applications',
    text: 'Certificates for internal services, from a private CA if needed.',
    icon: 'i-lucide-shield',
    tile: 'bg-[#EDE7FB]',
    iconColor: 'text-[#6D43C8]',
    textColor: 'text-[#12172B]'
  },
  {
    title: 'Microservices',
    text: 'mTLS between services and platforms, renewed automatically.',
    icon: 'i-lucide-git-fork',
    tile: 'bg-[#DDF4E6]',
    iconColor: 'text-[#17663A]',
    textColor: 'text-[#12172B]'
  },
  {
    title: 'APIs',
    text: 'Secure communication between backend systems and partners.',
    icon: 'i-lucide-code-xml',
    tile: 'bg-[#E6EEFC]',
    iconColor: 'text-[#2457C5]',
    textColor: 'text-[#12172B]'
  }
]
</script>