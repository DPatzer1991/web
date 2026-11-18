<template>
  <footer class="px-8 pb-8">
    <div class="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#E6E1EC] bg-white shadow-[0_30px_60px_-40px_rgba(30,42,71,0.4)]">

      <!-- ── Light Footer Section ────────────────────────────── -->
      <div class="footer-glow relative">
        <!-- Watermark, for decorative purposes only -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -bottom-9 right-7 flex select-none items-start text-[150px] font-extrabold leading-none tracking-tighter text-[rgba(30,58,120,0.06)]"
        >
          DNS<span class="-mt-1.5 text-[80px]">3L</span>
        </div>

         <FooterIllustration />

        <div class="relative flex flex-wrap items-start gap-12 p-10 pb-9">

          <!-- Brand -->
          <div class="flex shrink basis-85 flex-col gap-4">
            <NuxtLink
              to="/"
              class="flex w-fit items-start gap-0.75 text-[40px] font-extrabold leading-none tracking-[-0.04em] text-[#163B7A]"
            >
              DNS<span class="-mt-1 text-[20px] text-brand-500">3L</span>
            </NuxtLink>

            <p class="text-base leading-relaxed text-[#3A3F52]">
              Automated X.509 certificates for modern infrastructures.
            </p>

            <div class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
              <FooterFeature icon="i-lucide-shield-check" title="Secure" subtitle="DNS-01 validation" />
              <FooterFeature icon="i-lucide-zap" title="Automated" subtitle="via APIs" />
              <FooterFeature icon="i-lucide-layers" title="Multiple CAs" subtitle="Public &amp; private" />
            </div>
          </div>

          <!-- Link Columns -->
          <nav
            aria-label="Footer"
            class="grid shrink basis-125 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-8"
          >
            <FooterLinkGroup title="Product" :links="productLinks" />
            <FooterLinkGroup title="Tools" :links="toolLinks" />
          </nav>
        </div>
      </div>

      <!-- ── Dark Footer Section ────────────────────────────── -->
      <div class="flex flex-wrap items-center justify-between gap-6 bg-navy-800 px-10 py-6 text-[#D7DCEA]">

        <!--Left: Owner -->
        <div class="flex flex-col gap-0.5 text-sm">
          <strong class="font-bold text-white">Deutsche Telekom Technik GmbH</strong>
          <span>© {{ year }} DNS3L – Licensed under Apache 2.0</span>
        </div>

        <!-- Mid: Stack und Version -->
        <div class="flex flex-col items-center gap-1">
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tech in stack"
              :key="tech.label"
              class="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold"
              :class="tech.class"            
              >{{ tech.label }}</span>
          </div>

          <p v-if="loading" class="text-[13px] text-white">
            Loading…
          </p>
          <p v-else-if="error" class="text-[13px] text-white">
            Unable to load versions.
          </p>
          <template v-else>
            <span class="text-[13px] text-white">
              Version {{ appVersion }}
            </span>
            <span class="font-mono text-xs text-[#AEB6CC]">
              Backend: {{ info.version?.daemon }} | API: {{ info.version?.api }}
            </span>
          </template>
        </div>

        <!-- Right: Owner and Contact -->
        <div class="flex flex-col items-end gap-2.5">
          <span class="inline-flex items-center gap-1.5 text-sm">
            Made with
            <UIcon name="i-lucide-heart" class="size-4 text-brand-500" />
            by <strong class="font-bold text-white">Access 4.0</strong>
          </span>

          <div class="flex gap-2">
            <a
              href="https://github.com/dns3l"
              target="_blank"
              rel="noopener"
              aria-label="DNS3L auf GitHub"
              class="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <UIcon name="i-simple-icons-github" class="size-4.5" />
            </a>
            <a
              v-if="mailto"
              :href="mailto"
              aria-label="E-Mail an das DNS3L-Team"
              class="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <UIcon name="i-lucide-mail" class="size-4.5" />
            </a>
            <a
              v-if="info.contact?.url"
              :href="info.contact.url"
              target="_blank"
              rel="noopener"
              aria-label="DNS3L-Webseite"
              class="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <UIcon name="i-lucide-globe" class="size-4.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { FooterLink } from './FooterLinkGroup.vue'

/**
 * Application Footer.
 *
 * Version and contact data still come from /info or the
 * Runtime-Config; the design follows the redesign mockup.
 */
const { data: info, loading, error } = useInfo()

const appVersion = useRuntimeConfig().public.appVersion
const year = new Date().getFullYear()

const stack = [
  { label: 'Nuxt', class: 'bg-[#00DC82]/15 text-[#4DE8AC]' },
  { label: 'Tailwind', class: 'bg-[#06B6D4]/15 text-[#5FD8EC]' },
  { label: 'Vue', class: 'bg-[#42B883]/15 text-[#7BD6AC]' }
]

const productLinks: FooterLink[] = [
  { label: 'Certificate Authorities', to: '/browse' },
  { label: 'Claim Certificate', to: '/claim' },
  { label: 'API', to: '/swagger' }
]

const toolLinks: FooterLink[] = [
  { label: 'crt.sh', to: 'https://crt.sh', external: true },
  { label: 'jwt.io', to: 'https://jwt.io', external: true },
  { label: 'Decoder', to: 'https://www.redkestrel.co.uk/products/decoder', external: true },
  { label: 'DNS3L auf GitHub', to: 'https://github.com/dns3l', external: true }
]

/** mailto-Link, only when /info provides contact addresses. */
const mailto = computed(() => {
  const mails = info.value?.contact?.email
  return Array.isArray(mails) && mails.length
    ? `mailto:${mails.join(',')}?subject=Hello DNS3L...`
    : null
})
</script>

<style scoped>
.footer-glow {
  background-image:
    radial-gradient(45% 120% at 100% 40%, #d9e4fb 0%, rgba(217, 228, 251, 0) 70%),
    radial-gradient(30% 90% at 82% 110%, #ebddfb 0%, rgba(235, 221, 251, 0) 70%),
    linear-gradient(180deg, #ffffff 0%, #f7f8fd 100%);
}
</style>