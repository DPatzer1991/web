<template>
  <footer class="px-8 pb-8">
    <div class="mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-[#E6E1EC] bg-white shadow-[0_30px_60px_-40px_rgba(30,42,71,0.4)]">

      <!-- ── Helle Etage ─────────────────────────────── -->
      <div class="footer-glow relative">
        <!-- Wasserzeichen, rein dekorativ -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -bottom-9 right-7 flex select-none items-start text-[150px] font-extrabold leading-none tracking-[-0.05em] text-[rgba(30,58,120,0.06)]"
        >
          DNS<span class="-mt-1.5 text-[80px]">3L</span>
        </div>

         <FooterIllustration />

        <div class="relative flex flex-wrap items-start gap-12 p-10 pb-9">

          <!-- Marke -->
          <div class="flex shrink basis-[340px] flex-col gap-4">
            <NuxtLink
              to="/"
              class="flex w-fit items-start gap-[3px] text-[40px] font-extrabold leading-none tracking-[-0.04em] text-[#163B7A]"
            >
              DNS<span class="-mt-1 text-[20px] text-[#E2007B]">3L</span>
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

          <!-- Linkspalten -->
          <nav
            aria-label="Footer"
            class="grid shrink basis-[500px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-8"
          >
            <FooterLinkGroup title="Product" :links="productLinks" />
            <FooterLinkGroup title="Tools" :links="toolLinks" />
          </nav>
        </div>
      </div>

      <!-- ── Dunkle Etage ────────────────────────────── -->
      <div class="flex flex-wrap items-center justify-between gap-6 bg-[#1E2A47] px-10 py-6 text-[#D7DCEA]">

        <!-- Links: Betreiber -->
        <div class="flex flex-col gap-0.5 text-sm">
          <strong class="font-bold text-white">Deutsche Telekom Technik GmbH</strong>
          <span>© {{ year }} DNS3L – Licensed under Apache 2.0</span>
        </div>

        <!-- Mitte: Stack und Versionen -->
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

        <!-- Rechts: Urheber und Kontakt -->
        <div class="flex flex-col items-end gap-2.5">
          <span class="inline-flex items-center gap-1.5 text-sm">
            Made with
            <UIcon name="i-lucide-heart" class="size-4 text-[#E2007B]" />
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



<!--
<template>
  <footer class="footer footer-horizontal items-center p-4 bg-gray-600 text-slate-50">
    <div class="items-center grid-flow-col">
      <p>
        <span class="font-bold">Deutsche Telekom Technik GmbH</span><br>
        Copyright © 2026 - All rights reserved
      </p>
    </div>
    <div class="grid grid-flow-col justify-self-center">
      <div class="grid grid-cols-3 gap-2">
        <div class="justify-self-center">
          <a href="https://nuxtjs.org" target="_blank">
            <svg height="24" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.7203 29.704H41.1008C41.6211 29.7041 42.1322 29.5669 42.5828 29.3061C43.0334 29.0454 43.4075 28.6704 43.6675 28.2188C43.9275 27.7672 44.0643 27.2549 44.0641 26.7335C44.0639 26.2121 43.9266 25.6999 43.6662 25.2485L32.6655 6.15312C32.4055 5.70162 32.0315 5.32667 31.581 5.06598C31.1305 4.8053 30.6195 4.66805 30.0994 4.66805C29.5792 4.66805 29.0682 4.8053 28.6177 5.06598C28.1672 5.32667 27.7932 5.70162 27.5332 6.15312L24.7203 11.039L19.2208 1.48485C18.9606 1.03338 18.5864 0.658493 18.1358 0.397853C17.6852 0.137213 17.1741 0 16.6538 0C16.1336 0 15.6225 0.137213 15.1719 0.397853C14.7213 0.658493 14.3471 1.03338 14.0868 1.48485L0.397874 25.2485C0.137452 25.6999 0.000226653 26.2121 2.8053e-07 26.7335C-0.000226092 27.2549 0.136554 27.7672 0.396584 28.2188C0.656614 28.6704 1.03072 29.0454 1.48129 29.3061C1.93185 29.5669 2.44298 29.7041 2.96326 29.704H13.2456C17.3195 29.704 20.3239 27.9106 22.3912 24.4118L27.4102 15.7008L30.0986 11.039L38.1667 25.0422H27.4102L24.7203 29.704ZM13.0779 25.0374L5.9022 25.0358L16.6586 6.36589L22.0257 15.7008L18.4322 21.9401C17.0593 24.2103 15.4996 25.0374 13.0779 25.0374Z" fill="#00DC82" />
            </svg>
          </a>
        </div>
        <div class="justify-self-center">
          <a href="https://tailwindcss.com" target="_blank">
            <svg height="24" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M489.5 226.499C328 231.632 280 346.999 269 409.499C283.333 386.332 328.5 335.5 395 335.5C472.5 335.5 531.5 422 567.5 449C611.237 481.803 699.123 525.115 814.5 490C906.5 462 949.167 364.332 958.5 317.999C914 378.499 846.5 414.838 763 371.999C705.5 342.499 662.5 221 489.5 226.499Z" fill="#07B6D5" />
              <path d="M261 500.999C99.5 506.132 51.5 621.499 40.5 683.999C54.8333 660.832 100 610 166.5 610C244 610 303 696.5 339 723.5C382.737 756.303 470.623 799.615 586 764.5C678 736.5 720.667 638.832 730 592.499C685.5 652.999 618 689.338 534.5 646.499C477 616.999 434 495.5 261 500.999Z" fill="#07B6D5" />
            </svg>
          </a>
        </div>
        <div class="justify-self-center">
          <a href="https://v2.vuejs.org" target="_blank">
            <svg height="24" viewBox="0 0 196.32 170.02" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="120.83 0 98.16 39.26 75.49 0 0 0 98.16 170.02 196.32 0 120.83 0" fill="#42b883" />
              <polygon points="120.83 0 98.16 39.26 75.49 0 39.26 0 98.16 102.01 157.06 0 120.83 0" fill="#35495e" />
            </svg>
          </a>
        </div>
        <div class="col-span-3 text-xs text-center justify-self-center">
          <p v-if="loading">
            Loading....
          </p>
          <p v-else-if="error">
            Unable to load versions.
          </p>
          <p v-else>
            Version {{ $config.public.appVersion }}<br>
            Backend: {{ info.version?.daemon }}
            API: {{ info.version?.api }}
          </p>
        </div>
      </div>
    </div>
    <div class="justify-self-end">
      <p class="font-bold justify-self-end">
        Made with <span class="text-red-600">&hearts;</span> by Access 4.0
      </p>
      <div v-if="!loading && !error" class="grid grid-flow-col gap-4 justify-self-end">
        <a href="https://github.com/dns3l" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
            <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475c0-.237-.012-1.025-.012-1.862c-2.513.462-3.163-.613-3.363-1.175a3.636 3.636 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2.001 2.001 0 0 1 1.538 1.025a2.137 2.137 0 0 0 2.912.825a2.104 2.104 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.892 3.892 0 0 1 1.025-2.688a3.594 3.594 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.427 9.427 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.593 3.593 0 0 1 .1 2.65a3.869 3.869 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.563 4.937a2.368 2.368 0 0 1 .675 1.85c0 1.338-.012 2.413-.012 2.75c0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247z" />
          </svg>
        </a>
        <a v-if="Array.isArray(info.contact?.email)" :href="'mailto:' + info.contact?.email.join(',') + '?subject=Hello DNS3L...'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
        <a v-if="info.contact?.url" :href="info.contact?.url">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>
-->

<!-- 
<script>
export default {
  name: 'PageFooter',
  setup () {
    const { data: info, loading, error } = useInfo()
    return { info, loading, error }
  }
}
</script>
-->

<script setup lang="ts">
import type { FooterLink } from './FooterLinkGroup.vue'

/**
 * Anwendungsweiter Footer.
 *
 * Version und Kontaktdaten kommen weiterhin aus /info bzw. aus der
 * Runtime-Config; die Gestaltung folgt dem Redesign-Mockup.
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

// Früher das "Tools"-Dropdown im Header.
const toolLinks: FooterLink[] = [
  { label: 'crt.sh', to: 'https://crt.sh', external: true },
  { label: 'jwt.io', to: 'https://jwt.io', external: true },
  { label: 'Decoder', to: 'https://www.redkestrel.co.uk/products/decoder', external: true },
  { label: 'DNS3L auf GitHub', to: 'https://github.com/dns3l', external: true }
]

/** mailto-Link, nur wenn /info Kontaktadressen liefert. */
const mailto = computed(() => {
  const mails = info.value?.contact?.email
  return Array.isArray(mails) && mails.length
    ? `mailto:${mails.join(',')}?subject=Hello DNS3L...`
    : null
})
</script>

<style scoped>
/* Verläufe aus dem Mockup. Bewusst in CSS statt als Utility-Klasse:
   die Kommas und verschachtelten Klammern machen den Klassennamen
   unlesbar und fehleranfällig. */
.footer-glow {
  background-image:
    radial-gradient(45% 120% at 100% 40%, #d9e4fb 0%, rgba(217, 228, 251, 0) 70%),
    radial-gradient(30% 90% at 82% 110%, #ebddfb 0%, rgba(235, 221, 251, 0) 70%),
    linear-gradient(180deg, #ffffff 0%, #f7f8fd 100%);
}
</style>