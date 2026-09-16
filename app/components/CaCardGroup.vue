<template>
  <!-- See notes about fetch() in Footer.vue... -->
  <div v-if="!$fetchState.pending && !$fetchState.error" class="grid xl:grid-cols-3 lg:grid-cols-2 gap-1 lg:gap-2">
    <CaCard v-for="ca in cas" :key="ca.id" :ca="ca" />
  </div>
</template>

<script>
export default {
  name: 'CaCardGroup',
  data () {
    return {
      cas: []
    }
  },
  async fetch () {
    this.cas = await fetch(this.$config.public.apiURL + '/ca',
      this.$fetchHeader(this.$auth.loggedIn ? this.$auth.strategy.idToken.get() : null))
      .then(res => res.json())
  }
}
</script>
