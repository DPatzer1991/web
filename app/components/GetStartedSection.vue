<template>
  <section id="get-started" class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-8">

    <!-- Heading -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-wide text-[#2457C5]">Get started</span>
        <h2 class="text-[clamp(28px,3.2vw,40px)] font-extrabold leading-tight tracking-[-0.02em] text-[#12172B]">
          Ready for your first certificate?
        </h2>
      </div>
      <p class="max-w-105 text-[15px] leading-snug text-[#4B5063]">
        Pick one of the available CAs, claim it once, and let your
        application poll for updates and deploy renewed certs.
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">

      <!-- ---------- Left: available CAs ---------- -->
      <div class="flex flex-col gap-4 rounded-[20px] border border-[#ECE7EE] bg-white p-5">
        <div class="flex items-center justify-between gap-3">
          <h3 class="flex items-center gap-2 text-[17px] font-extrabold text-[#12172B]">
            Available CAs
            <span class="flex min-w-6 items-center justify-center rounded-full bg-[#E6EEFC] px-2 py-0.5 text-xs font-bold text-[#2457C5]">
              {{ cas.length }}
            </span>
          </h3>
          <NuxtLink to="/browse" class="text-sm font-bold text-[#2457C5] hover:underline">View all</NuxtLink>
        </div>

        <!-- Visibility filter -->
        <div class="flex gap-1 rounded-[12px] bg-[#F3F2F7] p-1">
          <button
            v-for="f in filters"
            :key="f.value"
            type="button"
            class="flex-1 rounded-[9px] px-3 py-2 text-[13px] font-bold transition-colors"
            :class="filter === f.value
              ? 'bg-white text-[#12172B] shadow-[0_6px_14px_-10px_rgba(18,23,43,0.7)]'
              : 'text-[#4B5063] hover:text-[#12172B]'"
            :aria-pressed="filter === f.value"
            @click="filter = f.value"
          >
            {{ f.label }} – {{ countFor(f.value) }}
          </button>
        </div>

        <!-- Loading placeholder, so the card does not jump once data arrives -->
        <div v-if="caLoading" class="flex flex-col gap-2.5">
          <div v-for="n in 3" :key="n" class="h-15.5 animate-pulse rounded-[14px] bg-[#F3F2F7]" />
        </div>

        <ul v-else class="m-0 flex list-none flex-col gap-2.5 p-0">
          <li v-for="ca in visibleCas" :key="ca.id">
            <label
              class="flex items-center gap-3 rounded-[14px] px-3.5 py-3 transition-colors"
              :class="[
                selected === ca.id
                  ? 'border-2 border-[#2457C5] bg-[#F3F7FE]'
                  : 'border border-[#ECE7EE] bg-white hover:bg-[#FAFAFD]',
                ca.enabled === false ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              ]"
            >
              <input
                v-model="selected"
                type="radio"
                name="ca"
                :value="ca.id"
                :disabled="ca.enabled === false"
                class="size-4 shrink-0 accent-[#2457C5]"
              >
              <CaLogo :id="ca.id" :name="ca.name" :logo="ca.logo" size="sm" />
              <span class="flex min-w-0 flex-1 flex-col">
                <span class="truncate text-[14.5px] font-bold text-[#12172B]">{{ ca.name }}</span>
                <span class="text-[12.5px] text-[#4B5063]">
                  {{ ca.totalIssued }} {{ ca.totalIssued === 1 ? 'certificate' : 'certificates' }}
                </span>
              </span>
              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
                :class="ca.type === 'private'
                  ? 'bg-[#EDE7FB] text-[#6D43C8]'
                  : 'bg-[#FDF0D5] text-[#9A5B1E]'"
              >
                {{ ca.type === 'private' ? 'Private' : 'Public' }}
              </span>
              <!-- Share of this CA's stored certificates currently inside their validity window -->
              <span v-if="ca.totalIssued > 0" class="w-11 shrink-0 text-right text-[12.5px] font-bold text-[#4B5063]">
                {{ percentValid(ca) }}%
              </span>
              <span v-else class="w-11 shrink-0 text-right text-[12.5px] text-[#9A97A6]">–</span>
            </label>
          </li>
        </ul>

        <p v-if="!caLoading && !visibleCas.length" class="py-6 text-center text-[14px] text-[#4B5063]">
          No CA matches this filter.
        </p>
      </div>

      <!-- ---------- Right: claim form ---------- -->
      <div class="flex flex-col gap-5 rounded-[20px] border border-[#D9E2F5] bg-linear-to-b from-white to-[#EEF2FB] p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-[20px] font-extrabold tracking-[-0.01em] text-[#12172B]">Claim your certificate</h3>
          <span v-if="selectedCa" class="rounded-full border border-[#E3E1EA] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#2B3044]">
            {{ selectedCa.name }} – {{ selectedCa.type }}
          </span>
        </div>

        <!-- Signed-in visitors get the full form one click away. Saying so here
             keeps them from filling this one in and then wondering where their
             certificate went. The Claim page starts empty for now. -->
        <div
          v-if="$auth?.loggedIn"
          class="flex flex-wrap items-center gap-3 rounded-[14px] border border-[#D9E2F5] bg-[#F3F7FE] px-4 py-3.5"
        >
          <svg class="size-5 shrink-0 text-[#2457C5]" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11.5v5" stroke-linecap="round" />
            <circle cx="12" cy="7.6" r=".9" fill="currentColor" stroke="none" />
          </svg>

          <span class="flex min-w-50 flex-1 flex-col">
            <span class="text-[14.5px] font-bold text-[#12172B]">
              You're logged in. Claim on the Claim page.
            </span>
            <span class="text-[12.5px] leading-snug text-[#4B5063]">
              This form is a preview. The full form with all options and your
              certificates is under Claim your certificate.
            </span>
          </span>

          <UButton
            to="/claim"
            variant="outline"
            color="neutral"
            class="shrink-0 rounded-[10px] border-[#DCD5E0] bg-white px-3.5 font-bold text-[#12172B]"
          >
            Go to Claim your certificate →
          </UButton>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <label for="gs-prefix" class="text-[13.5px] font-bold text-[#2B3044]">FQDN prefix</label>
            <input
              id="gs-prefix"
              v-model="prefix"
              type="text"
              placeholder="x5c.foobar"
              class="h-11 rounded-[10px] border border-[#DCD8E4] bg-white px-3.5 text-[14.5px] text-[#12172B] placeholder:text-[#9A97A6] focus:border-[#2457C5] focus:outline-none"
            >
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="gs-suffix" class="text-[13.5px] font-bold text-[#2B3044]">Domain suffix</label>
            <select
              id="gs-suffix"
              v-model="suffix"
              class="h-11 rounded-[10px] border border-[#DCD8E4] bg-white px-3 text-[14.5px] text-[#12172B] focus:border-[#2457C5] focus:outline-none"
            >
              <option value="">Please select one</option>
              <!-- Root zones the backend allows for the selected CA -->
              <option v-for="d in suffixes" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="gs-sans" class="text-[13.5px] font-bold text-[#2B3044]">
            Additional SANs <span class="font-normal text-[#4B5063]">– optional, comma-separated</span>
          </label>
          <input
            id="gs-sans"
            v-model="sans"
            type="text"
            placeholder="san1.example.com, san2.example.com"
            class="h-11 rounded-[10px] border border-[#DCD8E4] bg-white px-3.5 text-[14.5px] text-[#12172B] placeholder:text-[#9A97A6] focus:border-[#2457C5] focus:outline-none"
          >
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#DCD8E4] bg-white px-4 py-3.5">
            <input v-model="wildcard" type="checkbox" class="mt-0.5 size-4 shrink-0 accent-[#2457C5]">
            <span class="flex flex-col">
              <span class="text-[14.5px] font-bold text-[#12172B]">Wildcard</span>
              <span class="text-[12.5px] text-[#4B5063]">Every direct subdomain</span>
            </span>
          </label>
          <label class="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#DCD8E4] bg-white px-4 py-3.5">
            <input v-model="autodns" type="checkbox" class="mt-0.5 size-4 shrink-0 accent-[#2457C5]">
            <span class="flex flex-col">
              <span class="text-[14.5px] font-bold text-[#12172B]">AutoDNS</span>
              <span class="text-[12.5px] text-[#4B5063]">Create the A record too</span>
            </span>
          </label>
        </div>

        <!-- Resulting name and the endpoint an application can poll -->
        <div class="flex flex-col gap-3 rounded-[14px] bg-navy-800 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <span class="flex flex-col gap-0.5">
            <span class="text-[11.5px] font-bold uppercase tracking-wide text-[#9FB2D8]">You will get</span>
            <span class="font-mono text-[14px] text-white">{{ fqdn || '–' }}</span>
          </span>
          <span class="truncate font-mono text-[12.5px] text-[#9FB2D8]">{{ endpoint }}</span>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <!-- Dropped once signed in: the notice above already says what to do,
               and the same message twice reads like a warning. -->
          <p v-if="!$auth?.loggedIn" class="flex items-center gap-2 rounded-[10px] bg-[#FDF0D5] px-3.5 py-2 text-[13.5px] text-[#7A4A12]">
            🔒 Please log in to claim a certificate.
            <button type="button" class="font-bold underline" @click="login">Log in →</button>
          </p>
          <span v-else />

          <span class="flex items-center gap-3">
            <UButton variant="outline" color="neutral" class="rounded-[10px] border-[#DCD5E0] bg-white px-4 text-[#4B5063]" @click="reset">
              Reset
            </UButton>

            <!-- Signed in, the button is never locked: it only navigates, and the
                 claim itself happens on the Claim page. Signed out it stays
                 disabled, with the reason stated on the left. -->
            <UButton
              v-if="$auth?.loggedIn"
              to="/claim"
              class="rounded-[10px] bg-[#E20074] px-5 font-bold text-white hover:bg-[#C2005F]"
            >
              Continue on Claim page →
            </UButton>
            <UButton
              v-else
              disabled
              class="rounded-[10px] bg-navy-800 px-5 font-bold text-white disabled:bg-[#D7DAE3] disabled:text-[#8A8FA0]"
            >
              Get your certificate →
            </UButton>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Ca } from '~/composables/useDns3l'

/**
 * "Get started" section on the landing page.
 *
 * CAs and root zones come from the shared DNS3L composables. Which backend
 * answers is decided in the $api plugin: without a session the request goes
 * to the built-in mock, with a session it goes to dns3ld with a bearer token.
 * So the same markup shows demo data to visitors and real data after login.
 *
 * The form never submits. It is a preview that shows what a claim looks like;
 * signed-in users are told as much and sent to /claim, which starts empty.
 * Carrying the entered values over is deliberately left for later.
 */
const { $auth } = useNuxtApp()

const { data: cas, loading: caLoading } = useCaList()
const { data: rootZones } = useRootZones()

/* --- CA list and filter ------------------------------------------------ */

const filters = [
  { label: 'All', value: 'all' as const },
  { label: 'Public', value: 'public' as const },
  { label: 'Private', value: 'private' as const }
]
const filter = ref<'all' | 'public' | 'private'>('all')

const countFor = (v: typeof filter.value) =>
  v === 'all' ? cas.value.length : cas.value.filter(c => c.type === v).length

const visibleCas = computed(() =>
  filter.value === 'all' ? cas.value : cas.value.filter(c => c.type === filter.value)
)

/** Same formula as the CA table: valid certificates out of all stored ones. */
const percentValid = (ca: Ca) => Math.round((ca.totalValid / ca.totalIssued) * 100)

const selected = ref('')

/**
 * Preselect the first usable CA once the list arrives, and drop the
 * selection again when the data source changes on login or logout.
 */
watch(cas, (list) => {
  if (!list.some(c => c.id === selected.value)) {
    selected.value = list.find(c => c.enabled !== false)?.id ?? ''
  }
}, { immediate: true })

const selectedCa = computed(() => cas.value.find(c => c.id === selected.value))

/* --- Form state -------------------------------------------------------- */

const prefix = ref('')
const suffix = ref('')
const sans = ref('')
const wildcard = ref(false)
const autodns = ref(false)

/** Root zones usable with the selected CA; falls back to all known zones. */
const suffixes = computed(() => {
  const zones = rootZones.value ?? []
  const id = selected.value
  const usable = zones.filter(z => !id || !z.ca || z.ca.includes(id))
  return (usable.length ? usable : zones).map(z => z.root.replace(/\.$/, ''))
})

// A suffix that the newly selected CA cannot serve must not stay in the field.
watch(suffixes, (list) => {
  if (suffix.value && !list.includes(suffix.value)) suffix.value = ''
})

const fqdn = computed(() => {
  if (!prefix.value || !suffix.value) return ''
  return `${wildcard.value ? '*.' : ''}${prefix.value}.${suffix.value}`
})

const endpoint = computed(() =>
  `/api/v1/ca/${selected.value || '<ca>'}/crt/${fqdn.value || '<name>'}/pem/fullchain`
)

function reset() {
  prefix.value = ''
  suffix.value = ''
  sans.value = ''
  wildcard.value = false
  autodns.value = false
}

function login() {
  $auth?.loginWith('dex', { returnTo: '/claim' })
}
</script>