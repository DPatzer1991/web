<template>
  <div>
    <HeroSection />

    <!-- Noch im alten Zustand, kommen Abschnitt für Abschnitt dran -->
    <div class="mx-auto flex max-w-[1280px] flex-wrap gap-8 px-4 py-12 sm:px-8">
      <HowtoUse class="h-fit flex-1" />
      <HowitWorks class="h-fit min-w-min flex-1" />
      <Claim class="h-fit flex-none" />
      <CaCardGroup />
    </div>
  </div>
</template>

<script setup lang="ts">
// Dirigent der Startseite: nur Abschnitte, keine eigene Logik.
</script>