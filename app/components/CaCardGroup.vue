<template>
  <section class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-8">

    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-1.5">
        <h1 class="text-[clamp(30px,3.6vw,42px)] font-extrabold leading-tight tracking-[-0.02em] text-[#12172B]">
          Certificate Authorities
        </h1>
        <p class="text-[14px] text-[#4B5063]">
          {{ cas.length }} {{ cas.length === 1 ? 'CA' : 'CAs' }} configured –
          {{ publicCount }} public, {{ privateCount }} private
        </p>
        <span v-if="demo" class="w-fit rounded-full bg-[#FDF0D5] px-3 py-1 text-[12px] font-bold text-[#9A5B1E]">
          Demo – example data, nothing is issued
        </span>
      </div>
      <!-- Claiming requires a session, so the shortcut only exists with one. -->
      <UButton
        v-if="$auth?.loggedIn"
        to="/claim"
        class="rounded-[10px] bg-brand-500 px-5 py-3 font-bold text-white hover:bg-[#c40069]"
      >
        + Claim certificate
      </UButton>
    </div>

    <!--
      Visibility filter. Purely client-side: the whole CA list arrives in one
      response and is never long enough to warrant server-side filtering.
    -->
    <div class="flex w-fit gap-1 rounded-[12px] bg-[#F3F2F7] p-1">
      <button
        v-for="f in filters"
        :key="f.value"
        type="button"
        class="rounded-[9px] px-4 py-2 text-[13px] font-bold transition-colors"
        :class="filter === f.value
          ? 'bg-white text-[#12172B] shadow-[0_6px_14px_-10px_rgba(18,23,43,0.7)]'
          : 'text-[#4B5063] hover:text-[#12172B]'"
        :aria-pressed="filter === f.value"
        @click="filter = f.value"
      >
        {{ f.label }} – {{ countFor(f.value) }}
      </button>
    </div>

    <!-- Skeletons keep the page height stable so nothing jumps on arrival. -->
    <div v-if="loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="n in 4" :key="n" class="h-75 animate-pulse rounded-[18px] bg-[#F3F2F7]" />
    </div>

    <div v-else-if="visible.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <CaCard v-for="ca in visible" :key="ca.id" :ca="ca" />
    </div>

    <p v-else class="rounded-[14px] border border-[#ECE7EE] bg-white px-5 py-8 text-center text-[15px] text-[#4B5063]">
      {{ cas.length ? 'No CA matches this filter.' : 'No certificate authorities available.' }}
    </p>
  </section>
</template>

<script setup lang="ts">
/**
 * Overview page content: every configured certificate authority as a card.
 *
 * The component does not know - and does not need to know - whether the mock
 * or the real daemon answered. That is settled in the $api plugin, which means
 * this markup is exercised identically in a demo and in production. Fewer code
 * paths, fewer surprises in the environment that matters.
 *
 * The system health panel from the design mockup is not implemented: there is
 * no endpoint reporting reachability of DNS servers, CAs, the database or the
 * auth endpoints, and a fabricated green dot is worse than none.
 */
const { $auth } = useNuxtApp()
const { data: cas, loading } = useCaList()

const filters = [
  { label: 'All', value: 'all' as const },
  { label: 'Public', value: 'public' as const },
  { label: 'Private', value: 'private' as const }
]
const filter = ref<'all' | 'public' | 'private'>('all')

/**
 * Anything not explicitly private counts as public.
 *
 * `catype` is a free-form string in the daemon config, validated only as
 * alphabetic. Treating every unexpected value as public keeps a typo from
 * hiding a CA from both filters at once.
 */
const matches = (type: string, want: 'public' | 'private') =>
  want === 'private' ? type === 'private' : type !== 'private'

const publicCount = computed(() => cas.value.filter(c => matches(c.type, 'public')).length)
const privateCount = computed(() => cas.value.filter(c => matches(c.type, 'private')).length)

const countFor = (v: typeof filter.value) => {
  // Early return narrows v to 'public' | 'private' for the line below.
  if (v === 'all') return cas.value.length
  return cas.value.filter(c => matches(c.type, v)).length
}

const visible = computed(() => {
  // Narrowing survives into the callback only for a const, not for filter.value.
  const f = filter.value
  if (f === 'all') return cas.value
  return cas.value.filter(c => matches(c.type, f))
})
/** Marks the page while the visitor is trying the app without an account. */
const demo = computed(() => isDemo())
</script>