<template>
  <div :key="tokenReload" class="grid grid-cols-3 m-8 gap-8">
    <div class="card bg-base-100 h-fit shadow-xl">
      <div class="card-body">
        <pre><code>{{ JSON.stringify($auth.$state, undefined, 2) }}</code></pre>
        <code>{{ $auth.strategy.token.status() }}</code>
      </div>
    </div>
    <div class="card bg-base-100 h-fit shadow-xl break-all">
      <div class="card-body">
        <h2 class="card-title">
          ID Token
        </h2>
        <code>{{ $auth.strategy.idToken.get() }}</code>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="$auth.fetchUser()">
            Refetch
          </button>
        </div>
      </div>
    </div>
    <div class="card bg-base-100 h-fit shadow-xl break-all">
      <div class="card-body">
        <h2 class="card-title">
          Auth Token
        </h2>
        <code>{{ $auth.strategy.token.get() }}</code>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="refreshTokens()">
            Refresh
          </button>
        </div>
      </div>
    </div>
    <div class="card bg-base-100 h-fit col-span-3 shadow-xl break-all">
      <div class="card-body">
        <h2 class="card-title">
          Refresh Token
        </h2>
        <code>{{ $auth.strategy.refreshToken.get() }}</code>
      </div>
    </div>
  </div>
</template>

<!--
  User: <b-badge>{{ $auth.hasScope('user') }}</b-badge>
  Test: <b-badge>{{ $auth.hasScope('test') }}</b-badge>
  Admin: <b-badge>{{ $auth.hasScope('admin') }}</b-badge>
-->

<script>
export default {
  name: 'UserTokens',
  data () {
    return {
      tokenReload: 0
    }
  },
  methods: {
    refreshTokens () {
      this.$auth.refreshTokens()
        .then((v) => {
          this.$auth.fetchUser() // ok, implicit
          // this.$nuxt.refresh() // data only, nop
          // this.$router.app.refresh() // nop
          // Howto refresh a component: https://michaelnthiessen.com/force-re-render/
          // this.$forceUpdate() // ok
          // this.tokenReload += 1 // ok
        })
        .catch((e) => {
          this.error = e + ''
        })
    }
  }
}
</script>
