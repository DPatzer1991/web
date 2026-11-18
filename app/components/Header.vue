<template>
  <header class="sticky top-0 z-20 border-b border-[#ECE7EE] bg-white/90 backdrop-blur-[10px]">
    <div class="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">

      <!-- Brand + Navigation-->
      <div class="flex items-center gap-9">
        <NuxtLink
          to="/"
          class="flex items-start gap-px text-2xl font-extrabold leading-none tracking-[-0.03em] text-[#163B7A]"
        >
          DNS<span class="-mt-1 text-sm text-brand-500">3L</span>
        </NuxtLink>

        <nav aria-label="Hauptnavigation" class="hidden items-center gap-1 md:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            active-class="text-[#E2007B]"
            class="rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-[#2B3044] transition-colors hover:text-brand-500"
          >{{ item.label }}</NuxtLink>
      </nav>
      </div>

      <!-- Account -->
      <div class="flex items-center gap-2">
        <UDropdownMenu v-if="$auth?.loggedIn" :items="accountItems">
          <button
            type="button"
            aria-label="Kontomenü"
            class="flex items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-black/5"
          >
            <span class="flex size-9 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
              {{ initials }}
            </span>
            <span class="hidden text-[15px] font-medium text-[#12172B] sm:inline">
              {{ $auth?.user?.name }}
            </span>
          </button>
        </UDropdownMenu>

        <UButton
          v-else
          icon="i-lucide-log-in"
          color="neutral"
          class="h-11 rounded-[10px] px-4.5 text-[15px] font-bold"
          @click="login"
        >
          Log in
        </UButton>

          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
            v-if="$auth?.loggedIn"
            class="md:hidden"
            aria-label="Menü öffnen"
            @click="mobileOpen = true"
          />
      </div>
    </div>

    <!-- Mobile Menu -->
    <USlideover v-model:open="mobileOpen" title="Navigation">
      <template #body>
        <nav class="flex flex-col gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            active-class="text-[#E2007B]"
            class="rounded-lg px-3 py-3 text-base font-medium text-[#2B3044] transition-colors hover:text-brand-500"
            @click="mobileOpen = false"
          >{{ item.label }}</NuxtLink>
        </nav>
      </template>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
/**
* Application header: Brand, main navigation, and account area.
* The navigation only appears after login; the API documentation
* is accessible via the footer. Under md, the navigation moves to
* a drawer so that the sticky bar remains a single line.
* $auth is queried continuously with ?.: the Auth plugin is
* asynchronous; it doesn't exist on the initial render.
*/
const { $auth } = useNuxtApp()
const mobileOpen = ref(false)

const navItems = computed(() => $auth?.loggedIn
  ? [
      { label: 'Certificate Authorities', to: '/browse' },
      { label: 'Claim your certificate', to: '/claim' }
    ]
  : []
)

const accountItems = computed(() => [[
  { label: $auth?.user?.email ?? 'Angemeldet', type: 'label' as const },
  { label: 'Abmelden', icon: 'i-lucide-log-out', onSelect: () => $auth?.logout() }
]])

/** Initials for the avatar circle, e.g., "Mock User" -> "MU". */
const initials = computed(() => String($auth?.user?.name ?? '?')
  .split(' ')
  .map(w => w[0])
  .slice(0, 2)
  .join('')
  .toUpperCase())

async function login () {
  await $auth?.loginWith('dex')
}
</script>