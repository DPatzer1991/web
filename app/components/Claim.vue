<template>
  <section class="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-[clamp(26px,3.2vw,34px)] font-extrabold tracking-[-0.02em] text-[#12172B]">
        Claim a certificate
      </h1>
      <p class="text-[14px] text-[#4B5063]">
        Claim once. DNS3L validates via DNS-01 and keeps it renewed.
      </p>
    </header>

    <!--
      Reference material, collapsed by default. Fed with the CA and name from
      the form below, so the snippets are ready to copy once something is typed.
    -->
    <ClaimHowTo
      ref="howTo"
      :ca-id="form.ca.value"
      :name="form.name.value"
      @go-to-form="scrollToForm"
    />

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">

      <!-- ===================== Form ===================== -->
      <form
        ref="formEl"
        class="flex flex-col gap-6 rounded-[16px] border bg-white p-6 transition-all duration-500"
        :class="flash
          ? 'border-[#F3C9DC] shadow-[0_0_0_6px_rgba(226,0,123,0.12)]'
          : 'border-[#ECE7EE]'"
        @submit.prevent="send"
      >

        <!-- ---------- 1 Certificate authority ---------- -->
        <fieldset class="flex flex-col gap-3 border-0 p-0">
          <legend class="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-[#4B5063]">
            1 – Certificate authority
          </legend>

          <div class="flex w-fit gap-1 rounded-[10px] bg-[#F3F2F7] p-1">
            <button
              v-for="f in filters"
              :key="f.value"
              type="button"
              class="rounded-[7px] px-3 py-1.5 text-[12px] font-bold transition-colors"
              :class="caFilter === f.value ? 'bg-white text-[#12172B]' : 'text-[#4B5063] hover:text-[#12172B]'"
              :aria-pressed="caFilter === f.value"
              @click="caFilter = f.value"
            >
              {{ f.label }} – {{ countFor(f.value) }}
            </button>
          </div>

          <!-- CA tiles. The subline is derived from the API fields, see caProfile. -->
          <div class="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            <label
              v-for="c in visibleCas"
              :key="c.id"
              class="flex items-center gap-2.5 rounded-[11px] px-3 py-2.5 transition-colors"
              :class="[
                form.ca.value === c.id ? 'border-2 border-[#2457C5] bg-[#F3F7FE]' : 'border border-[#ECE7EE] hover:bg-[#FAFAFD]',
                c.enabled === false ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              ]"
            >
              <input
                v-model="form.ca.value"
                type="radio"
                name="ca"
                :value="c.id"
                :disabled="c.enabled === false"
                class="size-4 shrink-0 accent-[#2457C5]"
              >
              <CaLogo :id="c.id" :name="c.name" :logo="c.logo" size="sm" />
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-[13px] font-bold text-[#12172B]">{{ c.name }}</span>
                <span class="truncate text-[11px] text-[#4B5063]">{{ subline(c) }}</span>
              </span>
            </label>
          </div>

          <!-- Guidance for the selected CA -->
          <div
            v-if="selectedCa"
            class="flex flex-col gap-1 rounded-[10px] bg-[#EFF4FD] px-4 py-3 text-[12.5px] leading-snug text-[#2B3044]"
          >
            <p>
              <strong class="font-bold text-[#12172B]">{{ selectedCa.name }} is good for:</strong>
              {{ describeCa(selectedCa).goodFor.join(' · ') }}
            </p>
            <p>
              <strong class="font-bold text-[#12172B]">Choose it when:</strong>
              {{ describeCa(selectedCa).chooseWhen }}
            </p>
          </div>

          <p v-if="form.errors.ca" class="text-[12.5px] font-bold text-[#C8364B]">
            Please choose a certificate authority.
          </p>
        </fieldset>

        <!-- ---------- 2 Name ---------- -->
        <fieldset class="flex flex-col gap-4 border-0 p-0">
          <legend class="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-[#4B5063]">2 – Name</legend>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label for="cl-prefix" class="text-[13px] font-bold text-[#2B3044]">FQDN prefix</label>
              <input
                id="cl-prefix"
                ref="prefixInput"
                v-model.trim="form.prefix.value"
                type="text"
                autocomplete="off"
                spellcheck="false"
                placeholder="app or x5c.foobar"
                class="h-10 rounded-[9px] border bg-white px-3 font-mono text-[13.5px] text-[#12172B] placeholder:font-sans placeholder:text-[#9A97A6] focus:outline-none"
                :class="form.errors.prefix ? 'border-2 border-[#C8364B]' : 'border-[#DCD8E4] focus:border-[#2457C5]'"
              >
              <p class="text-[11.5px] text-[#4B5063]">
                Without <code class="font-mono">*</code> and without the domain, e.g. <code class="font-mono">app</code>.
              </p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="cl-suffix" class="text-[13px] font-bold text-[#2B3044]">Domain suffix</label>
              <select
                id="cl-suffix"
                v-model="form.rtz.value"
                class="h-10 rounded-[9px] border bg-white px-2.5 text-[13.5px] text-[#12172B] focus:outline-none"
                :class="form.errors.rtz ? 'border-2 border-[#C8364B]' : 'border-[#DCD8E4] focus:border-[#2457C5]'"
              >
                <option value="">Please select one</option>
                <!-- Root zones delegated to DNS3L, narrowed to the chosen CA -->
                <option v-for="z in form.zones.value" :key="z.root" :value="z.root">
                  {{ z.root.replace(/\.$/, '') }}
                </option>
              </select>
              <p v-if="!form.zonesLoading.value && !form.zones.value.length" class="text-[11.5px] text-[#9A5B1E]">
                No delegated root zone is available for this CA.
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="cl-san" class="text-[13px] font-bold text-[#2B3044]">
              Additional SANs <span class="font-normal text-[#4B5063]">– optional, comma-separated</span>
            </label>
            <input
              id="cl-san"
              v-model.trim="form.san.value"
              type="text"
              autocomplete="off"
              spellcheck="false"
              placeholder="api, www"
              class="h-10 rounded-[9px] border bg-white px-3 font-mono text-[13.5px] text-[#12172B] placeholder:font-sans placeholder:text-[#9A97A6] focus:outline-none"
              :class="form.errors.san ? 'border-2 border-[#C8364B]' : 'border-[#DCD8E4] focus:border-[#2457C5]'"
            >
            <p class="text-[11.5px] text-[#4B5063]">
              Prefixes only – the domain suffix above is appended to each entry.
            </p>
          </div>
        </fieldset>

        <!-- ---------- 3 Options ---------- -->
        <fieldset class="flex flex-col gap-3 border-0 p-0">
          <legend class="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-[#4B5063]">3 – Options</legend>

          <label class="flex cursor-pointer items-start gap-3 rounded-[11px] border border-[#DCD8E4] px-4 py-3">
            <input v-model="form.wildcard.value" type="checkbox" class="mt-0.5 size-4 shrink-0 accent-[#2457C5]">
            <span class="flex flex-col">
              <span class="text-[13.5px] font-bold text-[#12172B]">Wildcard</span>
              <span class="text-[12px] text-[#4B5063]">Covers every direct subdomain of the name</span>
            </span>
          </label>

          <label
            class="flex items-start gap-3 rounded-[11px] border border-[#DCD8E4] px-4 py-3"
            :class="form.autodnsAvailable.value ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
          >
            <input
              v-model="form.autodns.value"
              type="checkbox"
              :disabled="!form.autodnsAvailable.value"
              class="mt-0.5 size-4 shrink-0 accent-[#2457C5]"
            >
            <span class="flex flex-col">
              <span class="text-[13.5px] font-bold text-[#12172B]">AutoDNS</span>
              <span class="text-[12px] text-[#4B5063]">Also create the A record for the name in internal DNS</span>
              <!-- Say why it is unavailable instead of leaving a dead checkbox -->
              <span v-if="form.wildcard.value" class="text-[11.5px] text-[#9A5B1E]">
                Not available for wildcards – an A record needs one concrete name.
              </span>
              <span v-else-if="form.rtz.value && !form.autodnsAvailable.value" class="text-[11.5px] text-[#9A5B1E]">
                This root zone has no AutoDNS provider configured.
              </span>
            </span>
          </label>

          <!--
            IPv4 for the A record: shown only while AutoDNS is on, and required
            then - the daemon validates it as `required,ipv4` (AutoDNSInfo).
          -->
          <div v-if="form.autodns.value" class="flex flex-col gap-1.5 rounded-[11px] bg-[#F7F8FD] px-4 py-3">
            <label for="cl-ip" class="text-[13px] font-bold text-[#2B3044]">
              IPv4 address <span class="font-normal text-[#4B5063]">– required for the A record</span>
            </label>
            <input
              id="cl-ip"
              v-model.trim="form.ip.value"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="10.0.0.1"
              class="h-10 max-w-50 rounded-[9px] border bg-white px-3 font-mono text-[13.5px] text-[#12172B] placeholder:font-sans placeholder:text-[#9A97A6] focus:outline-none"
              :class="form.errors.ip ? 'border-2 border-[#C8364B]' : 'border-[#DCD8E4] focus:border-[#2457C5]'"
            >
            <p class="text-[11.5px] text-[#4B5063]">
              The address your service answers on. This endpoint takes IPv4 only.
            </p>
          </div>
        </fieldset>

        <!-- ---------- Footer ---------- -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0EEF4] pt-4">
          <p class="flex items-center gap-2 text-[12.5px]" :class="form.hint.value ? 'text-[#9A5B1E]' : 'text-[#17663A]'">
            <span aria-hidden="true">●</span>
            {{ form.hint.value ?? 'Ready to claim.' }}
          </p>

          <div class="flex items-center gap-3">
            <UButton
              type="button"
              variant="outline"
              color="neutral"
              :disabled="form.loading.value"
              class="rounded-[9px] border-[#DCD5E0] bg-white px-4 text-[#4B5063]"
              @click="resetForm"
            >
              Reset
            </UButton>
            <UButton
              type="submit"
              :loading="form.loading.value"
              :disabled="!loggedIn || !!form.hint.value || form.loading.value"
              class="rounded-[9px] bg-navy-800 px-4 font-bold text-white hover:bg-[#16203a] disabled:bg-[#D7DAE3] disabled:text-[#8A8FA0]"
            >
              Get your certificate →
            </UButton>
          </div>
        </div>

        <p v-if="!loggedIn" class="rounded-[9px] bg-[#FDF0D5] px-3.5 py-2.5 text-[13px] text-[#7A4A12]">
          🔒 Please log in to claim a certificate.
        </p>

        <!-- Request errors stay with the form so nothing has to be retyped -->
        <div v-if="form.errorText.value" class="flex flex-col gap-1 rounded-[11px] border border-[#F3C9D2] bg-[#FDF2F4] px-4 py-3">
          <span class="text-[13px] font-bold text-[#C8364B]">The request was rejected</span>
          <code class="wrap-break-word text-[12px] text-[#C8364B]">{{ form.errorText.value }}</code>
        </div>
      </form>

      <!-- ===================== Summary ===================== -->
      <aside class="flex flex-col gap-3 self-start">
        <div class="flex flex-col gap-4 rounded-[16px] bg-navy-800 p-5">
          <span class="text-[10.5px] font-bold uppercase tracking-wide text-[#9FB2D8]">You will get</span>

          <div class="flex flex-col gap-1">
            <span class="text-[11px] text-[#9FB2D8]">Common name</span>
            <span class="break-all font-mono text-[13.5px] font-bold text-white">{{ form.fqdn.value || '–' }}</span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[11px] text-[#9FB2D8]">Subject alternative names</span>
            <span v-if="!form.sanList.value.length" class="text-[13px] text-white">none</span>
            <ul v-else class="m-0 flex list-none flex-col gap-0.5 p-0">
              <li v-for="s in form.sanList.value" :key="s" class="break-all font-mono text-[12px] text-white">{{ s }}</li>
            </ul>
          </div>

          <div v-if="form.autodns.value" class="flex flex-col gap-1">
            <span class="text-[11px] text-[#9FB2D8]">A record</span>
            <span class="font-mono text-[12.5px] text-white">{{ form.ip.value || '–' }}</span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[11px] text-[#9FB2D8]">Issued by</span>
            <span class="text-[13px] text-white">
              {{ selectedCa ? `${selectedCa.name} – ${selectedCa.type}` : '–' }}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[11px] text-[#9FB2D8]">Your app polls</span>
            <code class="break-all font-mono text-[11px] text-[#9FB2D8]">{{ form.endpoint.value }}</code>
          </div>
        </div>

        <p class="text-[12.5px] leading-snug text-[#4B5063]">
          Validation runs via DNS-01 in the delegated zone. Your hosts never
          need to be reachable from the internet.
        </p>
      </aside>
    </div>
      <!-- Shown after a successful claim instead of redirecting straight away:
         the PEM endpoint is the one thing the user needs next. -->
    <ClaimSuccess
      :result="created"
      @close="created = null"
      @browse="goToCertificates"
      @howto="showGuide"
    />
  </section>
</template>

<script setup lang="ts">
import type { Ca } from '~/composables/useDns3l'
import type { ClaimResult } from '~/components/ClaimSuccess.vue'

/**
 * Claim form for a new certificate.
 *
 * The component owns the layout and the CA picker; state, validation and the
 * request itself come from useClaimForm, so a second claim surface (the dialog
 * on a CA's certificate list) can reuse them without copying any rules.
 *
 * Deliberately not implemented: the TTL hint the API accepts
 * (CertClaimHints). Its allowed range is configured per CA and not reported by
 * the API, so the form cannot offer sensible bounds - leaving it out lets the
 * CA apply its own default.
 */
const { $auth } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const loggedIn = computed(() => !!$auth?.loggedIn)
const { data: cas } = useCaList()

const form = useClaimForm()

/* --- CA picker --------------------------------------------------------- */

const filters = [
  { label: 'All', value: 'all' as const },
  { label: 'Public', value: 'public' as const },
  { label: 'Private', value: 'private' as const }
]
const caFilter = ref<'all' | 'public' | 'private'>('all')

/** Anything not explicitly private counts as public, as elsewhere in the UI. */
const matches = (type: string, want: 'public' | 'private') =>
  want === 'private' ? type === 'private' : type !== 'private'

const countFor = (v: typeof caFilter.value) => {
  // Early return narrows v for the line below.
  if (v === 'all') return cas.value.length
  return cas.value.filter(c => matches(c.type, v)).length
}

const visibleCas = computed(() => {
  // Narrowing survives into the callback only for a const.
  const f = caFilter.value
  if (f === 'all') return cas.value
  return cas.value.filter(c => matches(c.type, f))
})

const selectedCa = computed(() => cas.value.find(c => c.id === form.ca.value))

/** One line under the CA name: visibility, protocol and the derived tags. */
const subline = (c: Ca) =>
  [c.type === 'private' ? 'Private' : 'Public', c.acme ? 'ACME' : 'Legacy', ...describeCa(c).tags]
    .join(' · ')

/**
 * Preselect from ?ca=… , which is how the landing page hands over, and
 * otherwise take the first usable CA once the list has arrived.
 */
watch(cas, (list) => {
  if (list.some(c => c.id === form.ca.value)) return
  const fromQuery = String(route.query.ca ?? '')
  form.ca.value = list.find(c => c.id === fromQuery)?.id
    ?? list.find(c => c.enabled !== false)?.id
    ?? ''
}, { immediate: true })

/* --- Prefill and focus -------------------------------------------------- */

// Values handed over by the landing page's short form.
form.prefix.value = String(route.query.prefix ?? '')
form.san.value = String(route.query.san ?? '')
form.wildcard.value = route.query.wildcard === '1'

const formEl = ref<HTMLFormElement | null>(null)
const prefixInput = ref<HTMLInputElement | null>(null)

onMounted(() => prefixInput.value?.focus({ preventScroll: true }))

/** Jump from the guide down to the form and put the cursor where it belongs. */
/** Brief highlight after the jump, so the eye finds the form again. */
const flash = ref(false)
let flashTimer: ReturnType<typeof setTimeout> | undefined

function scrollToForm() {
  formEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  prefixInput.value?.focus({ preventScroll: true })

  flash.value = true
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => { flash.value = false }, 1200)
}

// A pending timer must not fire after the component is gone.
onBeforeUnmount(() => clearTimeout(flashTimer))

/* --- Actions ------------------------------------------------------------ */

/** The finished claim; while set, the success dialog is open. */
const created = ref<ClaimResult | null>(null)

const howTo = ref<{ openStep: (n?: number) => void } | null>(null)

async function send() {
  // Read the values before the form is touched, so the dialog shows what was
  // actually sent rather than whatever is in the fields afterwards.
  const fqdn = form.fqdn.value
  const sans = [...form.sanList.value]
  const caId = form.ca.value
  const caName = selectedCa.value?.name ?? caId
  const caType = selectedCa.value?.type ?? ''

  const name = await form.submit()
  if (!name) return

  created.value = {
    fqdn,
    sans,
    caName,
    caType,
    endpoint: `/api/v1/ca/${caId}/crt/${name}/pem/fullchain`
  }
}

/** Leave for the CA's certificate list, where the new entry is visible. */
function goToCertificates() {
  const caId = form.ca.value
  created.value = null
  router.push(`/browse/${caId}`)
}

/** Stay on the page and open the usage guide at the "fetch the files" step. */
function showGuide() {
  created.value = null
  howTo.value?.openStep(2)
  nextTick(() => {
    document.getElementById('tech-howto')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function resetForm() {
  form.reset()
  prefixInput.value?.focus({ preventScroll: true })
}
</script>