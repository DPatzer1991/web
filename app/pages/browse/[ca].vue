<template>
  <section class="mx-auto flex max-w-[1280px] flex-col gap-5 px-4 py-8 sm:px-8">

    <!-- Breadcrumb: the CA list is the only parent, so one level is enough -->
    <nav class="flex items-center gap-2 text-[13px]" aria-label="Breadcrumb">
      <NuxtLink to="/browse" class="text-[#4B5063] underline hover:text-[#2457C5]">
        Certificate Authorities
      </NuxtLink>
      <span aria-hidden="true" class="text-[#9A97A6]">/</span>
      <span class="font-bold text-[#12172B]">{{ ca?.name ?? caId }}</span>
    </nav>

    <!-- CA header. Same fields as the overview card, so both stay consistent. -->
    <header v-if="ca" class="flex flex-col gap-2">
      <div class="flex flex-wrap items-center gap-3">
        <CaLogo :id="ca.id" :name="ca.name" :logo="ca.logo" />
        <h1 class="text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.02em] text-[#12172B]">
          {{ ca.name }}
        </h1>
        <span
          class="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          :class="ca.type === 'private' ? 'bg-[#EDE7FB] text-[#6D43C8]' : 'bg-[#FDF0D5] text-[#9A5B1E]'"
        >
          {{ ca.type === 'private' ? 'Private' : 'Public' }}
        </span>
        <span class="rounded-full bg-[#F1F0F5] px-2.5 py-0.5 text-[11px] font-bold text-[#4B5063]">
          {{ ca.acme ? 'ACME' : 'Legacy' }}
        </span>
      </div>
      <p class="text-[14.5px] text-[#4B5063]">
        Renewal runs automatically. Certificates below {{ DUE_DAYS }} days are flagged.
      </p>
    </header>

    <!-- Loading and error states come before the table so it never renders half-empty -->
    <div v-if="listLoading" class="flex flex-col gap-2">
      <div v-for="n in 4" :key="n" class="h-16 animate-pulse rounded-[12px] bg-[#F3F2F7]" />
    </div>

    <p v-else-if="error" class="rounded-[14px] border border-[#F3C9D2] bg-[#FDF2F4] px-5 py-4 text-[15px] text-[#C8364B]">
      Could not load certificates: {{ apiErrorText(error) }}
    </p>

    <template v-else>
      <div class="overflow-x-auto rounded-[18px] border border-[#ECE7EE] bg-white">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-[#F0EEF4]">
              <th class="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#4B5063]">Certificate</th>
              <th class="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#4B5063]">Issued / by</th>
              <th class="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#4B5063]">Expires</th>
              <th class="w-[220px] px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#4B5063]">Remaining</th>
              <th class="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-[#4B5063]">PEM</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="c in visibleCrts"
              :key="c.name"
              class="border-b border-[#F4F3F7] last:border-0"
              :class="rowTone(c)"
            >
              <!-- Name, flags and serial number -->
              <td class="px-5 py-4 align-top">
                <div class="flex flex-wrap items-center gap-2">
                  <!--
                    Public certificates are in the Certificate Transparency logs,
                    so crt.sh can show the issued certificate itself. For a private
                    CA such a link would always be a dead end.
                  -->
                  <a
                    v-if="caIsPublic"
                    :href="`https://crt.sh/?CN=${trimDot(c.name)}&match=LIKE`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-mono text-[13.5px] font-bold text-[#12172B] hover:text-[#2457C5] hover:underline"
                  >{{ trimDot(c.name) }}</a>
                  <span v-else class="font-mono text-[13.5px] font-bold text-[#12172B]">
                    {{ trimDot(c.name) }}
                  </span>

                  <span v-if="c.wildcard" class="rounded-full bg-[#E6EEFC] px-2 py-0.5 text-[10.5px] font-bold text-[#2457C5]">
                    Wildcard
                  </span>
                  <!-- Renew count: how often DNS3L has already replaced this certificate -->
                  <span
                    v-if="c.renewCount > 0"
                    class="rounded-full bg-[#F1F0F5] px-2 py-0.5 text-[10.5px] font-bold text-[#4B5063]"
                    :title="`Renewed ${c.renewCount} times`"
                  >↻ {{ c.renewCount }}</span>
                </div>

                <a
                  v-if="caIsPublic"
                  :href="`https://crt.sh/?serial=${serialToHex(c.serial)}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-0.5 block font-mono text-[11.5px] text-[#4B5063] hover:underline"
                >S/N {{ c.serial }}</a>
                <span v-else class="mt-0.5 block font-mono text-[11.5px] text-[#4B5063]">
                  S/N {{ c.serial }}
                </span>
              </td>

              <!-- Who claimed it and when -->
              <td class="px-5 py-4 align-top">
                <span class="block text-[13.5px] text-[#12172B]">{{ formatDate(c.claimedOn) }}</span>
                <span class="block text-[12px] text-[#4B5063]">{{ c.claimedBy?.email }}</span>
              </td>

              <td class="px-5 py-4 align-top">
                <span class="block text-[13.5px] text-[#12172B]">{{ formatDate(c.validTo) }}</span>
                <span class="block text-[12px] text-[#4B5063]">{{ formatTime(c.validTo) }}</span>
              </td>

              <!-- Remaining lifetime, as a number and as a share of the full period -->
              <td class="px-5 py-4 align-top">
                <div class="flex items-baseline justify-between gap-2">
                  <span class="text-[14px] font-bold" :class="tone(c).text">
                    {{ daysLeft(c) }} {{ daysLeft(c) === 1 ? 'day' : 'days' }}
                  </span>
                  <span class="text-[12.5px] font-bold" :class="tone(c).text">{{ tone(c).label }}</span>
                </div>
                <div class="mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-[#EDEBF1]">
                  <div class="h-full rounded-full" :class="tone(c).bar" :style="{ width: remaining(c) }" />
                </div>
              </td>

              <!-- PEM actions -->
              <td class="px-5 py-4 align-top">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    :disabled="!clipboard"
                    class="relative rounded-[8px] border border-[#DCD8E4] bg-white px-3 py-1.5 text-[12.5px] font-bold text-[#2B3044] hover:bg-[#FAFAFD] disabled:opacity-50"
                    title="Copy the private key to the clipboard"
                    @click="copyPem(c, 'key')"
                  >
                    {{ copied === `${c.name}:key` ? 'Copied!' : 'Key' }}
                  </button>

                  <button
                    type="button"
                    :disabled="!clipboard"
                    class="rounded-[8px] border border-[#DCD8E4] bg-white px-3 py-1.5 text-[12.5px] font-bold text-[#2B3044] hover:bg-[#FAFAFD] disabled:opacity-50"
                    title="Copy certificate and chain to the clipboard"
                    @click="copyPem(c, 'fullchain')"
                  >
                    {{ copied === `${c.name}:fullchain` ? 'Copied!' : 'Fullchain' }}
                  </button>

                  <button
                    type="button"
                    class="rounded-[8px] border border-[#DCD8E4] bg-white p-1.5 text-[#4B5063] hover:bg-[#FAFAFD]"
                    title="Download the full chain as a .pem file"
                    @click="downloadPem(c, 'fullchain')"
                  >
                    <UIcon name="i-lucide-download" class="size-4" />
                  </button>

                  <button
                    type="button"
                    :disabled="!loggedIn"
                    class="rounded-[8px] border border-[#F3C9D2] bg-white p-1.5 text-[#C8364B] hover:bg-[#FDF2F4] disabled:opacity-40"
                    :title="loggedIn ? 'Delete this certificate' : 'Sign in to delete certificates'"
                    @click="askDelete(c)"
                  >
                    <UIcon name="i-lucide-trash-2" class="size-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!visibleCrts.length">
              <td colspan="5" class="px-5 py-10 text-center text-[15px] text-[#4B5063]">
                {{ crts.length ? 'All certificates of this CA have expired.' : 'No certificates issued by this CA yet.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Count line plus the switch for expired entries -->
      <p class="text-[13px] text-[#4B5063]">
        Showing {{ visibleCrts.length }} of {{ crts.length }}
        {{ crts.length === 1 ? 'certificate' : 'certificates' }}
        <template v-if="expiredCount > 0">
          – {{ expiredCount }} expired
          <button type="button" class="font-bold text-[#2457C5] underline" @click="showExpired = !showExpired">
            {{ showExpired ? 'hide' : 'show' }}
          </button>
        </template>
      </p>
    </template>

    <!--
      Delete confirmation. Hand-rolled rather than a library dialog so it keeps
      working regardless of the component library in use.
    -->
    <div
      v-if="pending"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#12172B]/40 px-4"
      role="dialog"
      aria-modal="true"
      @click.self="cancelDelete"
    >
        <div class="flex w-full max-w-115 flex-col gap-4 rounded-[18px] bg-white p-6">       
        <div class="flex items-start gap-3 rounded-[12px] bg-[#FDF0D5] px-4 py-3">
          <span aria-hidden="true">⚠️</span>
          <p class="text-[14px] font-bold text-[#7A4A12]">This action cannot be undone.</p>
        </div>

        <p class="text-[15px] text-[#2B3044]">Delete this certificate?</p>
        <p class="break-all text-center font-mono text-[15px] font-bold text-[#C8364B]">{{ pending }}</p>

        <p class="text-[12.5px] leading-snug text-[#4B5063]">
          You can claim the same name again later; a new key is generated in that
          case. Depending on the CA the certificate is revoked before deletion.
        </p>

        <p v-if="deleteError" class="rounded-[10px] bg-[#FDF2F4] px-3.5 py-2.5 font-mono text-[12.5px] text-[#C8364B]">
          {{ deleteError }}
        </p>

        <div class="flex justify-end gap-3">
          <UButton
            variant="outline"
            color="neutral"
            :disabled="deleting"
            class="rounded-[10px] border-[#DCD5E0] bg-white px-4 text-[#4B5063]"
            @click="cancelDelete"
          >
            Cancel
          </UButton>
          <UButton
            :loading="deleting"
            :disabled="!loggedIn"
            class="rounded-[10px] bg-[#C8364B] px-5 font-bold text-white hover:bg-[#a82c3e]"
            @click="confirmDelete"
          >
            Delete
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Crt } from '~/composables/useDns3l'

/**
 * Certificates issued by one certificate authority.
 *
 * Scope of this page
 * ------------------
 * This is the only place that loads a full certificate list, which is why it
 * is also the only place that can sort and filter by expiry: the daemon offers
 * `search`, `suffix`, `limit` and `offset`, but no sort parameter, and orders
 * by domain name (ca/state/dbstate.go). Doing it here is correct as long as
 * the list is fully loaded - if CAs ever grow into the thousands, this is the
 * spot that needs server-side support, not the overview page.
 *
 * Both the CA metadata and the certificates come from the shared composables,
 * so navigating here from the overview reuses data already in memory, and the
 * mock/live decision is made in the $api plugin as everywhere else.
 */

/** Certificates at or below this many days left are flagged as due. */
const DUE_DAYS = 30
/** Below this they are critical - roughly a long weekend to react. */
const CRITICAL_DAYS = 7

const route = useRoute()
const router = useRouter()
const { $api, $auth } = useNuxtApp()

const caId = String(route.params.ca)

const caList = useCaList()
const certs = useCertificates(caId)

const crts = certs.data
const listLoading = computed(() => caList.loading.value || certs.loading.value)
const error = computed(() => caList.error.value || certs.error.value)

const ca = computed(() => caList.data.value.find(c => c.id === caId))
const caIsPublic = computed(() => ca.value?.type !== 'private')
const loggedIn = computed(() => !!$auth?.loggedIn)

/**
 * An unknown CA id in the URL is a dead end - send the user back to the list
 * instead of showing an empty table. Only after the list loaded successfully,
 * otherwise a slow request would bounce everyone out.
 */
watch(caList.status, (s) => {
  if (s === 'success' && !caList.data.value.some(c => c.id === caId)) router.replace('/browse')
}, { immediate: true })

/* --- Validity helpers -------------------------------------------------- */

const DAY = 24 * 60 * 60 * 1000
const daysLeft = (c: Crt) => Math.max(0, Math.floor((+new Date(c.validTo) - Date.now()) / DAY))
const isExpired = (c: Crt) => +new Date(c.validTo) <= Date.now()

/** Remaining time as a share of this certificate's own validity period. */
const remaining = (c: Crt) => {
  const total = +new Date(c.validTo) - +new Date(c.validFrom)
  const left = +new Date(c.validTo) - Date.now()
  if (total <= 0) return '0%'
  return `${Math.min(100, Math.max(0, (left / total) * 100))}%`
}

/**
 * Status wording and colour, derived from the remaining days.
 *
 * The backend has no status field: it stores validity dates and lets clients
 * decide what counts as urgent. The thresholds here are a UI decision and
 * intentionally independent of the daemon's own renewal threshold
 * (relativeLifetimeUntilRenew), which is a fraction of the lifetime rather
 * than a fixed number of days.
 */
function tone(c: Crt) {
  if (isExpired(c)) return { label: 'Expired', text: 'text-[#4B5063]', bar: 'bg-[#9A97A6]' }
  const d = daysLeft(c)
  if (d <= CRITICAL_DAYS) return { label: 'Critical', text: 'text-[#C8364B]', bar: 'bg-[#C8364B]' }
  if (d <= DUE_DAYS) return { label: 'Renewal due', text: 'text-[#9A5B1E]', bar: 'bg-[#E0922B]' }
  return { label: 'Valid', text: 'text-[#17663A]', bar: 'bg-[#2B3044]' }
}

/** Tint the whole row for the cases that need attention. */
const rowTone = (c: Crt) =>
  isExpired(c) ? 'bg-[#FAFAFB]' : daysLeft(c) <= CRITICAL_DAYS ? 'bg-[#FDF5F6]' : ''

/* --- Listing ----------------------------------------------------------- */

/**
 * Expired certificates stay in the backend until someone deletes them, so
 * they would otherwise clutter the list. They are hidden by default and one
 * click away, never silently dropped.
 */
const showExpired = ref(false)

const sorted = computed(() =>
  [...crts.value].sort((a, b) => +new Date(a.validTo) - +new Date(b.validTo))
)
const expiredCount = computed(() => sorted.value.filter(isExpired).length)
const visibleCrts = computed(() =>
  showExpired.value ? sorted.value : sorted.value.filter(c => !isExpired(c))
)

/* --- PEM actions -------------------------------------------------------- */

const clipboard = ref(false)
onMounted(() => { clipboard.value = !!navigator.clipboard })

/** Key of the button currently showing its "Copied!" state. */
const copied = ref('')

/**
 * Copy one PEM object to the clipboard.
 *
 * The PEM payload is fetched once per certificate and cached on the object
 * itself (useCertificates enables deep reactivity for exactly this), so
 * copying key and fullchain in a row costs a single request.
 */
async function copyPem(c: Crt, part: 'key' | 'fullchain' | 'cert' | 'chain' | 'root') {
  try {
    if (!c.loaded) {
      // Fetched once per certificate and cached on the object itself, so
      // copying key and fullchain in a row costs a single request.
      c.pem = await $api<Record<string, string>>(`/ca/${caId}/crt/${trimDot(c.name)}/pem`)
      c.loaded = true
    }

    // Indexed access is `string | undefined`, and a CA may not provide every
    // PEM object - so check instead of asserting.
    const value = c.pem?.[part]
    if (!value) throw new Error(`This certificate has no "${part}" PEM object.`)

    await navigator.clipboard.writeText(value)
    copied.value = `${c.name}:${part}`
    setTimeout(() => { copied.value = '' }, 1300)
  } catch (e) {
    useNotification().notify('PEM could not be loaded: ' + apiErrorText(e), 'error')
  }
}

/**
 * Download a PEM object as a file.
 *
 * A plain <a href> cannot be used: the endpoint requires the bearer token that
 * $api adds automatically. Fetching through the client and handing the browser
 * a temporary blob URL keeps the token out of the address bar and history.
 */
async function downloadPem(c: Crt, part: 'fullchain' | 'key' | 'cert' | 'chain' | 'root') {
  try {
    const pem = await $api(`/ca/${caId}/crt/${trimDot(c.name)}/pem/${part}`, { responseType: 'text' })
    const url = URL.createObjectURL(new Blob([pem as string], { type: 'application/x-pem-file' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${trimDot(c.name)}.${part}.pem`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    useNotification().notify('Download failed: ' + apiErrorText(e), 'error')
  }
}

/* --- Deletion ----------------------------------------------------------- */

/** Name of the certificate awaiting confirmation; empty means no dialog. */
const pending = ref('')
const deleting = ref(false)
const deleteError = ref('')

function askDelete(c: Crt) {
  pending.value = trimDot(c.name)
  deleteError.value = ''
}

function cancelDelete() {
  if (deleting.value) return
  pending.value = ''
  deleteError.value = ''
}

/**
 * Delete through the API and refresh the shared list.
 *
 * Errors stay inside the dialog on purpose, so the name is still on screen
 * and the user can read what went wrong before deciding what to do.
 */
async function confirmDelete() {
  deleting.value = true
  deleteError.value = ''
  try {
    await $api(`/ca/${caId}/crt/${pending.value}`, { method: 'DELETE' })
    pending.value = ''
    await certs.refresh()
  } catch (e) {
    deleteError.value = apiErrorText(e)
  } finally {
    deleting.value = false
  }
}

/* --- Formatting --------------------------------------------------------- */

/** DNS names may be fully qualified with a trailing dot; URLs and files are not. */
const trimDot = (n: string) => n.replace(/\.$/, '')

/** Serial numbers are stored as decimals; crt.sh looks them up in hex. */
const serialToHex = (s: string) => BigInt(s).toString(16)

const formatDate = (d: string) => new Date(d).toLocaleDateString('de-DE', { dateStyle: 'medium' })
const formatTime = (d: string) => new Date(d).toLocaleTimeString('de-DE', { timeStyle: 'medium' })
</script>