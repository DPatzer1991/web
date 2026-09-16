<template>
  <div class="bg-slate-50">
    <div class="flex flex-row flex-wrap gap-4 lg:gap-8 m-4 lg:m-8">
      <WhatitIs />
      <HowtoUse class="flex-1 h-fit" />
      <HowitWorks class="flex-1 min-w-min h-fit" />
      <Claim class="flex-none h-fit" />
      <CaCardGroup />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHome'
}
</script>
