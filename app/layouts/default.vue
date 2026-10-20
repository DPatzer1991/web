<template>
    <!-- Main application layout:
       header and footer stay consistent while page content
       is rendered inside the slot. -->
  <div class="flex min-h-screen flex-col bg-[#F7F8FD]">
    <Header />
     <!-- Fills the remaining viewport height and scrolls
         independently when the page content becomes too large. -->
    <main class="mb-auto">
      <slot />
    </main>
    <Footer />
  </div>
</template>
