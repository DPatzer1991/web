<template>
  <div class="flex flex-col h-screen">
    <Header />
    <main class="mb-auto flex-1 overflow-y-auto bg-slate-50">
      <slot />
    </main>
    <Footer />
  </div>
</template>
