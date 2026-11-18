<template>
  <section class="hero-bg flex flex-col justify-center pb-16">
    <div class="mx-auto grid w-full max-w-7xl grid-cols-[repeat(auto-fit,minmax(min(520px,100%),1fr))] gap-12 px-4 pt-6 sm:px-8 sm:pt-10">

      <!-- ── Text column ────────────────────────────── -->
      <div class="flex flex-col gap-6.5">
        <div class="flex flex-wrap gap-2.5">
          <span
            v-for="tag in tags"
            :key="tag"
            class="rounded-full border border-[#E6E1EC] bg-white px-3 py-1.5 text-[13px] font-medium text-[#2B3044]"
          >{{ tag }}</span>
        </div>

        <h1 class="text-[clamp(44px,5.4vw,68px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#12172B]">
          Claim a certificate once.
          <span class="text-[#2457C5]">Renewal is our job.</span>
        </h1>

        <p class="max-w-140 text-lg leading-relaxed text-[#4B5063]">
          A central X.509 claiming and renewal system for air-gapped environments,
          focused on TLS and ACME via DNS-01 validation. Public ACME CAs spare you
          private root chains; a private ACME CA covers a stricter threat model.
        </p>

        <div class="flex flex-wrap gap-3.5">
          <UButton
            trailing-icon="i-lucide-arrow-right"
            class="h-13 rounded-xl bg-brand-500 px-6.5 text-base font-bold text-white hover:bg-[#c40069]"
            @click="claim"
          >
            Get your certificate
          </UButton>
          <UButton
            to="/browse"
            variant="outline"
            color="neutral"
            class="h-13 rounded-xl border-[#D8D4E0] bg-white px-6.5 text-base font-bold text-[#12172B]"
          >
            Browse CAs
          </UButton>
        </div>

        <div class="flex flex-wrap gap-5 pt-3">
          <div v-for="f in features" :key="f.title" class="flex items-center gap-3">
            <span
              class="flex size-11 shrink-0 items-center justify-center rounded-xl"
              :class="f.tone"
            >
              <UIcon :name="f.icon" class="size-5" />
            </span>
            <span class="text-[13px] font-medium leading-tight text-[#2B3044]">
              {{ f.title }}<br>{{ f.subtitle }}
            </span>
          </div>
        </div>
      </div>

      <HeroPreview class="hidden lg:block" />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
* Introductory section of the homepage.
* The image on the right (HeroPreview) is a static representation
* of the interface and was deliberately taken from the accessibility tree
 */
const { $auth } = useNuxtApp()

const tags = ['X.509 for TLS', 'Air-gapped ready', 'ACME - DNS-01']

const features = [
  { icon: 'i-lucide-lock', title: 'Secure', subtitle: 'by design', tone: 'bg-[#E6EEFC] text-[#2457C5]' },
  { icon: 'i-lucide-zap', title: 'Automated', subtitle: 'renewal', tone: 'bg-[#EAE4FB] text-[#6C47D9]' },
  { icon: 'i-lucide-globe', title: 'DNS-01', subtitle: 'validation', tone: 'bg-[#DFEEFC] text-[#1F6FC4]' },
  { icon: 'i-lucide-shield-check', title: 'Private & public', subtitle: 'CAs supported', tone: 'bg-[#DDF4E6] text-[#17864A]' }
]

/**
* /claim is protected. Without a session, the route guard would silently return to /
* so we start the registration directly with a return destination.
 */
async function claim () {
  if ($auth?.loggedIn) {
    await navigateTo('/claim')
  } else {
    await $auth?.loginWith('dex', { returnTo: '/claim' })
  }
}
</script>

<style scoped>
.hero-bg {
  min-height: min(calc(100dvh - 64px), 820px);
  background-image:
    radial-gradient(60% 70% at 80% 20%, #d3dff8 0%, rgba(251, 211, 234, 0) 70%),
    radial-gradient(45% 60% at 95% 80%, #d9e4fb 0%, rgba(217, 228, 251, 0) 70%),
    linear-gradient(180deg, #f5f7fe 0%, #f7f8fd 100%);
}
</style>