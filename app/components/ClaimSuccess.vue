<template>
  <div
    v-if="result"
    class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#12172B]/40 p-4 sm:items-center"
    role="dialog"
    aria-modal="true"
    aria-labelledby="claim-success-title"
    @click.self="emit('close')"
  >
    <div class="flex w-full max-w-117.5 flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_32px_64px_-24px_rgba(18,23,43,0.5)]">

      <header class="flex items-start gap-3 px-5 pt-5">
        <!-- Outlined check: a quiet confirmation, not a celebration. -->
        <span class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-[#9FD9B6]" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#17864A" stroke-width="2.4"
               stroke-linecap="round" stroke-linejoin="round" class="size-3.25">
            <path d="m5 12.5 4.5 4.5L19 7" />
          </svg>
        </span>

        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 id="claim-success-title" class="text-[16px] font-extrabold text-[#17663A]">
            Certificate created
          </h2>
          <p class="text-[13px] leading-snug text-[#4B5063]">
            <span class="font-mono">{{ result.fqdn }}</span> was created under the CA
            {{ result.caName }}.
          </p>
        </div>

        <button
          type="button"
          class="appearance-none rounded-full border-0 bg-transparent p-1.5 text-[#4B5063] transition-colors hover:bg-[#F3F2F7]"
          aria-label="Close"
          @click="emit('close')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </header>

      <!-- What was issued, in the daemon's own terms -->
      <dl class="m-4 grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-[12px] bg-[#F3FBF6] px-4 py-3.5 text-[13px]">
        <dt class="text-[#4B5063]">Common name</dt>
        <dd class="m-0 break-all font-mono text-[#12172B]">{{ result.fqdn }}</dd>

        <dt class="text-[#4B5063]">SANs</dt>
        <dd class="m-0 break-all font-mono text-[#12172B]">
          <template v-if="result.sans.length">
            <span v-for="s in result.sans" :key="s" class="block">{{ s }}</span>
          </template>
          <span v-else class="font-sans text-[#4B5063]">none</span>
        </dd>

        <dt class="text-[#4B5063]">CA</dt>
        <dd class="m-0 text-[#12172B]">{{ result.caName }} – {{ result.caType }}</dd>

        <dt class="text-[#4B5063]">PEM endpoint</dt>
        <dd class="m-0 break-all font-mono text-[#2457C5]">{{ result.endpoint }}</dd>
      </dl>

      <footer class="flex flex-wrap justify-end gap-3 border-t border-[#F0EEF4] px-5 py-4">
        <UButton
          variant="outline"
          color="neutral"
          class="rounded-[9px] border-[#DCD5E0] bg-white px-4 text-[#4B5063]"
          @click="emit('howto')"
        >
          Show how to use it
        </UButton>
        <UButton
          class="rounded-[9px] bg-brand-500 px-4 font-bold text-white hover:bg-[#c40069]"
          @click="emit('browse')"
        >
          Go to my certificates →
        </UButton>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Confirmation after a successful claim.
 *
 * The dialog exists because the claim used to end in a redirect, which hid
 * the one thing the user needs next: the PEM endpoint their application will
 * poll. Showing it here means they can copy it before leaving the page.
 *
 * Everything displayed is what was actually sent and accepted, assembled by
 * the page - this component holds no state of its own.
 */
export type ClaimResult = {
  /** Common name as it appears in the certificate, wildcard marker included. */
  fqdn: string
  sans: string[]
  caName: string
  caType: string
  endpoint: string
}

defineProps<{
  /** The finished claim, or null while no dialog should be shown. */
  result: ClaimResult | null
}>()

const emit = defineEmits<{
  close: []
  /** Open the usage guide instead of leaving the page. */
  howto: []
  /** Go to the certificate list of that CA. */
  browse: []
}>()

/** Escape closes the dialog, as users expect from a modal. */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>