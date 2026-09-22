<template>
  <!-- See notes about fetch() in Footer.vue... -->
  <div v-if="!loading && !error" class="grid xl:grid-cols-3 lg:grid-cols-2 gap-1 lg:gap-2">
    <CaCard v-for="ca in cas" :key="ca.id" :ca="ca" />
  </div>
</template>

<script>
export default {
  name: 'CaCardGroup',
  setup () {
    const { data: cas, loading, error } = useCaList()
    return { cas, loading, error }
  }
}
</script>
