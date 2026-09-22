<template>
  <div v-if="!$fetchState.pending && !$fetchState.error">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <table class="table table-compact overflow-x-auto">
          <thead>
            <tr>
              <td>Certificate authority</td>
              <td>% valid</td>
              <td />
            </tr>
          </thead>
          <tbody>
            <tr v-for="ca in cas" :key="ca.id" :class="{ active: ! ca.enabled }" class="hover">
              <td>
                <NuxtLink :to="'/browse/' + ca.id.toLowerCase()" :disabled="(! $auth.loggedIn || ! ca.enabled) || undefined">
                  <b>{{ ca.name }}</b>
                </NuxtLink>
                <CaBadges :type="ca.type" :acme="ca.acme" :count="ca.totalIssued" />
                <p class="whitespace-normal text-xs font-light">
                  {{ ca.desc }}
                </p>
              </td>
              <td>
                <div v-if="ca.totalValid && ca.totalIssued" class="radial-progress bg-[#e20074] text-white border-4 border-[#e20074]" :style="'--size:2rem; --value:' + Math.round((ca.totalValid / ca.totalIssued) * 100)">
                  <b>{{ Math.round((ca.totalValid / ca.totalIssued) * 100) }}</b>
                </div>
              </td>
              <td>
                <BrowseButton :ca="ca" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaTable',
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
