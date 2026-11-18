<template>
  <article
    class="flex flex-col overflow-hidden rounded-[18px] border border-[#ECE7EE] bg-white"
    :class="{ 'opacity-60': ca.enabled === false }"
  >
    <header class="flex flex-col gap-3 px-5 pt-5">
      <div class="flex items-start gap-3">
        <CaLogo :id="ca.id" :name="ca.name" :logo="ca.logo" />
        <div class="flex min-w-0 flex-col gap-0.5">
          <h3 class="truncate text-[17px] font-extrabold tracking-[-0.01em] text-[#12172B]">
            {{ ca.name }}
          </h3>
          <!--
            The only CA-specific prose available: the `description` field from
            the operator's config.yaml. Rendering it keeps the card useful in
            installations this build has never seen.
          -->
          <p v-if="ca.desc" class="text-[13px] leading-snug text-[#4B5063]">
            {{ ca.desc }}
          </p>
        </div>
      </div>

      <!--
        Badges are limited to properties the API really reports:
        `type` (public/private) and `acme`. Labels such as DV, OV,
        "Not trusted" or "Test only" exist in the design mockup but in no
        backend field, so they are left out rather than guessed.
      -->
      <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
        <li
          class="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          :class="isPrivate ? 'bg-[#EDE7FB] text-[#6D43C8]' : 'bg-[#FDF0D5] text-[#9A5B1E]'"
        >
          {{ isPrivate ? 'Private' : 'Public' }}
        </li>
        <li class="rounded-full bg-[#F1F0F5] px-2.5 py-0.5 text-[11px] font-bold text-[#4B5063]">
          {{ ca.acme ? 'ACME' : 'Legacy' }}
        </li>
        <li v-if="ca.enabled === false" class="rounded-full bg-[#FBE3E7] px-2.5 py-0.5 text-[11px] font-bold text-[#C8364B]">
          Disabled
        </li>
      </ul>
    </header>

    <!-- Inventory, from the counters contained in the same /ca response -->
    <div class="mx-5 mt-4 flex flex-col gap-2.5 rounded-[12px] border border-[#ECE7EE] px-4 py-3.5">
      <div class="flex items-baseline justify-between gap-3">
        <span class="text-[11px] font-bold uppercase tracking-wide text-[#4B5063]">Certificates</span>
        <span v-if="ca.totalIssued > 0" class="text-[12px] font-bold text-[#2457C5]">
          {{ percentValid }}% valid
        </span>
      </div>

      <p v-if="ca.totalIssued === 0" class="text-[14px] text-[#4B5063]">
        No certificates issued yet.
      </p>

      <template v-else>
        <p class="text-[14px] text-[#2B3044]">
          <strong class="font-bold text-[#12172B]">{{ ca.totalValid }}</strong>
          of {{ ca.totalIssued }} currently valid
        </p>
        <div class="h-1.25 w-full overflow-hidden rounded-full bg-[#EDEBF1]">
          <div class="h-full rounded-full bg-[#2B3044]" :style="{ width: percentValid + '%' }" />
        </div>
        <p v-if="expiredCount > 0" class="text-[12.5px] text-[#9A5B1E]">
          {{ expiredCount }} expired {{ expiredCount === 1 ? 'certificate' : 'certificates' }} still on record
        </p>
      </template>
    </div>

    <!-- Link to the CA's root certificates, when the operator configured one -->
    <a
      v-if="ca.roots"
      :href="ca.roots"
      target="_blank"
      rel="noopener noreferrer"
      class="mx-5 mt-3 text-[13px] font-bold text-[#2457C5] hover:underline"
    >
      Root certificates ↗
    </a>

    <div class="mt-auto p-5">
      <UButton
        :to="`/browse/${ca.id}`"
        :disabled="ca.enabled === false"
        block
        class="rounded-[10px] bg-navy-800 py-3 font-bold text-white hover:bg-[#16203a]"
      >
        Browse {{ ca.totalIssued }} {{ ca.totalIssued === 1 ? 'certificate' : 'certificates' }} →
      </UButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Ca } from '~/composables/useDns3l'

/**
 * One certificate authority, rendered as a card.
 *
 * Deliberate scope
 * ----------------
 * This component issues no request of its own. Everything it shows is part of
 * the single `GET /ca` response, so the overview page costs exactly one
 * request no matter how many CAs are configured.
 *
 * An earlier draft showed a preview of the two certificates closest to expiry.
 * That was dropped for two reasons: it would add one request per card, and the
 * daemon offers no way to ask for "the ones expiring next" - it orders by
 * domain name and has no sort parameter. Sorting in the browser works only as
 * long as the full list is loaded, which stops being true the moment anyone
 * has a few thousand certificates. The per-CA certificate list lives on the
 * detail page, where loading it fully is the point.
 *
 * What the counters mean
 * ----------------------
 * `totalIssued` counts all rows stored for this CA; `totalValid` counts those
 * whose validity window contains the current time (ca/state/dbstate.go). The
 * percentage is therefore not a health or availability indicator: a CA with a
 * single expired certificate reads 0 % while working perfectly. It is shown
 * next to the inventory, where that reading is the natural one.
 */
const props = defineProps<{ ca: Ca }>()

const isPrivate = computed(() => props.ca.type === 'private')

const percentValid = computed(() =>
  props.ca.totalIssued > 0 ? Math.round((props.ca.totalValid / props.ca.totalIssued) * 100) : 0
)

/** Difference between both counters: expired, but not yet deleted. */
const expiredCount = computed(() => Math.max(0, props.ca.totalIssued - props.ca.totalValid))
</script>