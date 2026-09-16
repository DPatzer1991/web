<template>
  <header class="navbar bg-[#e20074] border-b border-grey">
    <div class="indicator">
      <!-- span class="indicator-item indicator-bottom badge border-none bg-sky-600 text-amber-200">mock</span -->
      <div class="flex-none ml-4 px-2 pb-2 rounded bg-slate-200">
        <a href="/"><Logo /></a>
      </div>
    </div>
    <div class="flex-1 pl-4">
      <NuxtLink to="/browse" class="btn btn-ghost normal-case text-slate-50 text-l">
        CA
      </NuxtLink>
      <NuxtLink v-if="$auth.loggedIn" to="/claim" class="btn btn-ghost normal-case text-slate-50 text-l">
        Claim
      </NuxtLink>
      <!-- NuxtLink to="/doc" class="btn btn-ghost normal-case text-slate-50 text-l">
        Doc
      </NuxtLink -->
      <NuxtLink to="/swagger" class="btn btn-ghost normal-case text-slate-50 text-l">
        API
      </NuxtLink>
      <!-- NuxtLink v-if="$auth.loggedIn" to="/tokens" class="btn btn-ghost normal-case text-slate-50 text-l">
        Tokens
      </NuxtLink -->
      <div class="dropdown dropdown-hover">
        <label tabindex="0" class="btn btn-ghost normal-case text-slate-50 text-l">Tools</label>
        <ul tabindex="0" class="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-48">
          <li><a href="https://crt.sh" target="_blank">crt.sh</a></li>
          <!-- div class="m-0 p-0 divider"/ -->
          <li><a href="https://jwt.io" target="_blank">jwt.io</a></li>
          <!-- https://certificatedecoder.dev -->
          <li><a href="https://www.redkestrel.co.uk/products/decoder" target="_blank">Decoder</a></li>
          <li><a href="https://loremipsum.de" target="_blank">Lorem ipsum</a></li>
        </ul>
      </div>
    </div>
    <div class="flex-none">
      <Notification v-if="notification" :message="notification" />
      <div id="notification" />
    </div>
    <div class="flex-none mr-4">
      <button v-if="$auth.loggedIn" class="btn btn-primary normal-case text-slate-50 gap-2" @click="logout">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        {{ $auth.user.name }}
      </button>
      <button v-else class="btn btn-primary gap-2 normal-case text-slate-50" @click="login">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Login
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PageHeader',

  data () {
    return {
      notification: null // 'Hello world. Here is a message...'
    }
  },

  methods: {
    async login () {
      try {
        const response = await this.$auth.loginWith('dex')
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    },
    async logout () {
      await this.$auth.logout()
    }
  }
}
</script>
