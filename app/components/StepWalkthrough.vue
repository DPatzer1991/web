<template>
  <section id="how-it-works" class="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-16 sm:px-8">

    <!-- Heading -->
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-wide text-[#2457C5]">
          How it works – in the UI 
        </span>
        <h2 class="text-[clamp(26px,2.8vw,32px)] font-extrabold leading-tight tracking-[-0.02em] text-[#12172B]">
          From login to auto-renewal in 6 steps.
        </h2>
        <p class="text-[15px] text-[#4B5063]">
          Click through the screens: what you do in DNS3L and which problem each step solves.
        </p>
      </div>
    </div>

    <div class="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">

      <!-- Step list -->
      <ol class="m-0 flex list-none flex-col gap-2.5 p-0">
        <li v-for="(s, i) in steps" :key="s.title">
          <button
            type="button"
            class="flex w-full items-start gap-3 rounded-[14px] px-4 py-3.5 text-left transition-colors"
            :class="i === current
              ? 'border-2 border-navy-800 bg-[#F3F7FE] shadow-[0_16px_32px_-24px_rgba(30,42,71,0.6)]'
              : 'border border-[#ECE7EE] bg-white hover:bg-[#FAFAFD]'"
            :aria-current="i === current ? 'step' : undefined"
            @click="current = i"
          >
            <span
              class="flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
              :class="i === current ? 'bg-navy-800 text-white'
                : i < current ? 'bg-[#DDF4E6] text-[#17663A]' : 'bg-[#E6EEFC] text-[#1A4F8A]'"
            >{{ i < current ? '✓' : i + 1 }}</span>
            <span class="flex flex-col gap-0.5">
              <span class="text-[15px] font-bold text-[#12172B]">{{ s.title }}</span>
              <span class="text-[13px] text-[#4B5063]">{{ s.short }}</span>
            </span>
          </button>
        </li>
      </ol>

      <!-- Screen + explanation -->
      <div class="flex flex-col gap-4">
        <div class="overflow-hidden rounded-[18px] border border-[#E3E1EA] bg-white">
          <div class="flex items-center gap-3 border-b border-[#E8E6EE] bg-[#F4F3F7] px-3.5 py-2.5">
            <div aria-hidden="true" class="flex gap-1.5">
              <span class="size-2.5 rounded-full bg-[#FF5F57]" />
              <span class="size-2.5 rounded-full bg-[#FEBC2E]" />
              <span class="size-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span class="mx-auto max-w-90 flex-1 truncate rounded-lg border border-[#E5E3EC] bg-white px-3 py-1 text-center font-mono text-[11.5px] text-[#4B5063]">
              {{ step.url }}
            </span>
            <span class="shrink-0 text-xs font-medium text-[#4B5063]">
              Step {{ current + 1 }} of {{ steps.length }}
            </span>
          </div>

          <!-- Screenshot, or a friendly placeholder while it is missing -->
          <img
            v-if="!missing[current]"
            :src="step.image"
            :alt="`Screenshot: ${step.title}`"
            class="block w-full bg-[#F7F8FD]"
            loading="lazy"
            @error="missing[current] = true"
          >
          <div
            v-else
            class="placeholder flex min-h-95 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
          >
            <span class="text-6xl" aria-hidden="true">🙂</span>
            <span class="text-xl font-extrabold text-[#12172B]">Attachments will follow</span>
            <span class="max-w-90 text-[15px] leading-snug text-[#4B5063]">
              The Screenshot for „{{ step.title }}" is loading.
            </span>
            <span class="rounded-lg bg-white/70 px-3 py-1.5 font-mono text-xs text-[#4B5063]">
              {{ step.image }}
            </span>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-1.5 rounded-[14px] border border-[#ECE7EE] bg-white px-5 py-4">
            <span class="text-xs font-bold uppercase tracking-wide text-[#4B5063]">What you do</span>
            <p class="text-[15px] leading-snug text-[#2B3044]">{{ step.does }}</p>
          </div>
          <div class="flex flex-col gap-1.5 rounded-[14px] border border-[#CDEBD9] bg-[#F3FBF6] px-5 py-4">
            <span class="text-xs font-bold uppercase tracking-wide text-[#17663A]">Problem solved ✅</span>
            <p class="text-[15px] leading-snug text-[#2B3044]">{{ step.solves }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between gap-3">
          <UButton
            variant="outline"
            color="neutral"
            :disabled="current === 0"
            class="rounded-[10px] border-[#DCD5E0] bg-white px-4 text-[#4B5063]"
            @click="current--"
          >
            ← Back
          </UButton>
          <UButton
            v-if="current < steps.length - 1"
            color="neutral"
            class="rounded-[10px] px-5 font-bold"
            @click="current++"
          >
            Next step →
          </UButton>
          <UButton
            v-else
            to="/claim"
            class="rounded-[10px] bg-brand-500 px-5 font-bold text-white hover:bg-[#c40069]"
          >
            Get your certificate →
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Six-step walkthrough of the UI.
 *
 * The screens are real screenshots from the running application, stored
 * as WebP under public/screens/. Screenshots instead of rebuilt mock
 * screens keep this section in sync with the actual product.
 *
 * A screenshot that cannot be loaded is replaced by a friendly
 * placeholder, so a missing file never breaks the layout.
 */
const current = ref(0)

/** Per-step flag, set when the browser fails to load the image. */
const missing = reactive<Record<number, boolean>>({})

const steps = [
  {
    title: 'Log in',
    short: 'Your preferred account',
    url: 'dns3l.example.com/login',
    image: '/screens/step-1-login.webp',
    does: 'Sign in with your E-Mail and password. No extra user to create.',
    solves: 'No separate accounts per tool. Access follows your company identity.'
  },
  {
    title: 'Choose a CA',
    short: 'Public or private',
    url: 'dns3l.example.com/browse',
    image: '/screens/step-2-ca.webp',
    does: 'Pick the CA for your use case: a public ACME CA for public services, a private ACME CA for internal-only services.',
    solves: 'One place for all CAs instead of a separate process and contact per CA.'
  },
  {
    title: 'Claim the certificate',
    short: 'FQDN, SANs, options',
    url: 'dns3l.example.com/claim',
    image: '/screens/step-3-claim.webp',
    does: 'Enter the name, optional SANs and choose Wildcard or AutoDNS. One click on Get your certificate.',
    solves: 'No key and CSR by hand, no ticket, no waiting for someone else.'
  },
  {
    title: 'Validate & issue',
    short: 'DNS-01 runs automatically',
    url: 'dns3l.example.com/claim',
    image: '/screens/step-4-validate.webp',
    does: 'Nothing. DNS3L creates the TXT record, the CA validates it and issues the certificate.',
    solves: 'No manual DNS changes, no open ports, internal hosts stay internal.'
  },
  {
    title: 'Download & integrate',
    short: 'Key, Fullchain, endpoint',
    url: 'dns3l.example.com/browse/letsencrypt',
    image: '/screens/step-5-download.webp',
    does: 'Download key and full chain, or copy the endpoint URL into your app config.',
    solves: 'No certificates by mail or file share. One stable endpoint, even after renewals.'
  },
  {
    title: 'Monitor, renew, delete',
    short: 'Everything in one list',
    url: 'dns3l.example.com/browse/letsencrypt',
    image: '/screens/step-6-manage.webp',
    does: 'See what is due, let renewals run on their own and delete certificates you no longer need.',
    solves: 'No expiry spreadsheet, no surprise outages, no forgotten certificates.'
  }
]

/**
 * The step currently shown. Indexed access would be `Step | undefined`
 * under noUncheckedIndexedAccess, so we resolve it once here –
 * `current` is always a valid index, guarded by the Back/Next buttons.
 */
const step = computed(() => steps[current.value]!)

</script>

<style scoped>
/* Soft gradient for the placeholder, matching the hero background. */
.placeholder {
  background-image:
    radial-gradient(50% 60% at 80% 10%, #d3dff8 0%, rgba(211, 223, 248, 0) 70%),
    linear-gradient(180deg, #f7f8fd 0%, #eef2fb 100%);
}
</style>