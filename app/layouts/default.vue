<template>
    <!-- Main application layout:
       header and footer stay consistent while page content
       is rendered inside the slot. -->
  <div class="flex flex-col h-screen">
    <Header />
     <!-- Fills the remaining viewport height and scrolls
         independently when the page content becomes too large. -->
    <main class="mb-auto flex-1 overflow-y-auto bg-slate-50">
      <slot />
    </main>
    <Footer />
  </div>
</template>
