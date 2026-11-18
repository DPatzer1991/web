<template>
  <!-- Dekorative for the Network Icons in the Footer -->
  <div
    aria-hidden="true"
    class="pointer-events-none absolute right-10 top-1/2 hidden h-55 w-75 -translate-y-1/2 origin-right scale-80 xl:block"
  >
    <!-- Globus left: the network -->
    <div class="absolute left-0 top-17.5 flex size-16 items-center justify-center rounded-full border border-[#D6E2F7] bg-white/80 text-[#7FA2DE]">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
      </svg>
    </div>

    <!-- Two Services in the Middle -->
    <div class="absolute left-19 top-4.5 box-border flex h-11 w-16 flex-col justify-center gap-1.5 rounded-[10px] border border-[#D6E2F7] bg-white/90 px-2.5">
      <span class="h-1 w-[70%] rounded bg-[#C9D6F0]" />
      <span class="h-1 w-[70%] rounded bg-[#C9D6F0]" />
    </div>
    <div class="absolute left-19 top-35 box-border flex h-11 w-16 flex-col justify-center gap-1.5 rounded-[10px] border border-[#D6E2F7] bg-white/90 px-2.5">
      <span class="h-1 w-[70%] rounded bg-[#C9D6F0]" />
      <span class="h-1 w-[70%] rounded bg-[#E9C3DD]" />
    </div>

    <!-- Pointed Connection -->
    <div class="absolute left-16 top-25.25 w-27.5 border-t-2 border-dotted border-[#A9BDE6]" />
    <div class="absolute left-35 top-10 w-10 border-t-2 border-dotted border-[#A9BDE6]" />
    <div class="absolute left-35 top-40.5 w-10 border-t-2 border-dotted border-[#A9BDE6]" />

    <!-- Certificate right -->
    <div class="illu-shield absolute right-0 top-7.5 flex size-35 items-center justify-center rounded-full">
      <svg width="76" height="76" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#2457C5" stroke-width="1.3" stroke-linejoin="round">
        <path d="M12 2.5 4 5.6v6.1c0 5 3.4 8.8 8 9.8 4.6-1 8-4.8 8-9.8V5.6z" />
        <rect x="9" y="11" width="6" height="5" rx="1" fill="#1E3A78" stroke="none" />
        <path d="M10.2 11V9.6a1.8 1.8 0 0 1 3.6 0V11" fill="none" stroke="#1E3A78" stroke-width="1.2" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.illu-shield {
  background: radial-gradient(circle at 40% 35%, #ffffff 0%, #eef2fd 70%);
  box-shadow: 0 20px 40px -20px rgba(36, 87, 197, 0.4);
}
</style>