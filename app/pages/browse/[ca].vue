<template>
  <div v-if="!listLoading && !error">
    <div class="grid grid-cols-1 justify-items-center gap-2 m-8">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <table class="table table-compact overflow-x-auto">
            <thead>
              <tr>
                <td>Certificate name</td>
                <td>From (By)</td>
                <td>Expires</td>
                <td>Days left</td>
                <td>PEM</td>
                <td />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, i) in crts" :key="c.name" :class="{ active: ! (c.valid && isValid(c.validTo)) }" class="hover">
                <td>
                  <a v-if="caIsPublic" target="_blank" :href="'https://crt.sh/?CN=' + nameTrimDot(c.name) + '&match=LIKE'" class="whitespace-nowrap font-bold">
                    {{ nameTrimDot(c.name) }}
                  </a>
                  <span v-else class="whitespace-nowrap font-bold">
                    {{ nameTrimDot(c.name) }}
                  </span>
                  <span class="whitespace-normal">
                    <span v-if="c.wildcard" class="badge badge-sm badge-info text-slate-50">wildcard</span>
                    <span v-if="c.renewCount > 0" class="badge badge-sm">{{ c.renewCount }}</span>
                  </span>
                  <br>
                  <a v-if="caIsPublic" target="_blank" :href="'https://crt.sh/?serial=' + serialToHex(c.serial)" class="whitespace-nowrap text-xs font-light">
                    S/N: {{ c.serial }}
                  </a>
                  <span v-else class="whitespace-nowrap text-xs font-light">
                    S/N: {{ c.serial }}
                  </span>
                </td>
                <td>
                  {{ formatDate(c.claimedOn, { dateStyle: 'medium' }) }}<br>
                  &lt;{{ c.claimedBy.email }}&gt;
                </td>
                <td>
                  {{ formatDate(c.validTo) }}
                </td>
                <td>
                  <div v-if="c.valid && isValid(c.validTo)" class="radial-progress bg-[#e20074] text-white border-4 border-[#e20074]" :style="'--size:2.5rem; --value:' + Math.round((daysLeft(c.validTo) / daysTTL(c.validFrom, c.validTo)) * 100)">
                    <b>{{ daysLeft(c.validTo) }}</b>
                  </div>
                </td>
                <td class="whitespace-normal">
                  <!-- Why? Didactics...
                  <div class="indicator">
                    <span :class="{ visible: c.certCopied, invisible: !c.certCopied }" class="indicator-item badge badge-sm">Copied!</span>
                    <button :disabled="! clipboard" :class="{ 'btn-success': c.loaded }" class="btn btn-xs normal-case" @click="getPEM(i, 'cert')">
                      Cert
                    </button>
                  </div>
                  <div class="indicator">
                    <span :class="{ visible: c.chainCopied, invisible: !c.chainCopied }" class="indicator-item badge badge-sm">Copied!</span>
                    <button :disabled="! clipboard" :class="{ 'btn-success': c.loaded }" class="btn btn-xs normal-case" @click="getPEM(i, 'chain')">
                      Chain
                    </button>
                  </div>
                  -->
                  <div class="indicator">
                    <span :class="{ visible: c.keyCopied, invisible: !c.keyCopied }" class="indicator-item badge badge-sm">Copied!</span>
                    <button :disabled="! clipboard" :class="{ 'btn-success': c.loaded }" class="btn btn-xs normal-case" @click="getPEM(i, 'key')">
                      Key
                    </button>
                  </div>
                  <div class="indicator">
                    <span :class="{ visible: c.fullchainCopied, invisible: !c.fullchainCopied }" class="indicator-item badge badge-sm">Copied!</span>
                    <button :disabled="! clipboard" :class="{ 'btn-success': c.loaded }" class="btn btn-xs normal-case" @click="getPEM(i, 'fullchain')">
                      Fullchain
                    </button>
                  </div>
                  <a href="#" title="Fullchain herunterladen" class="btn btn-xs btn-ghost" @click.prevent="downloadPEM(c, 'fullchain')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3" viewBox="0 0 457.03 457.03" style="enable-background:new 0 0 457.03457.03;">
                      <g><path
                        d="M421.512,207.074l-85.795,85.767c-47.352,47.38-124.169,47.38-171.529,0c-7.46-7.439-13.296-15.821-18.421-24.465
                           l39.864-39.861c1.895-1.911,4.235-3.006,6.471-4.296c2.756,9.416,7.567,18.33,14.972,25.736c23.648,23.667,62.128,23.634,85.762,0
                           l85.768-85.765c23.666-23.664,23.666-62.135,0-85.781c-23.635-23.646-62.105-23.646-85.768,0l-30.499,30.532
                           c-24.75-9.637-51.415-12.228-77.373-8.424l64.991-64.989c47.38-47.371,124.177-47.371,171.557,0
                           C468.869,82.897,468.869,159.706,421.512,207.074z M194.708,348.104l-30.521,30.532c-23.646,23.634-62.128,23.634-85.778,0
                           c-23.648-23.667-23.648-62.138,0-85.795l85.778-85.767c23.665-23.662,62.121-23.662,85.767,0
                           c7.388,7.39,12.204,16.302,14.986,25.706c2.249-1.307,4.56-2.369,6.454-4.266l39.861-39.845
                           c-5.092-8.678-10.958-17.03-18.421-24.477c-47.348-47.371-124.172-47.371-171.543,0L35.526,249.96
                           c-47.366,47.385-47.366,124.172,0,171.553c47.371,47.356,124.177,47.356,171.547,0l65.008-65.003
                           C246.109,360.336,219.437,357.723,194.708,348.104z"
                      />
                      </g>
                    </svg>
                  </a>
                </td>
                <td>
                  <button class="btn btn-xs btn-error text-slate-50 normal-case" @click="deleteModalHandler(i, c.name)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div :class="{ 'modal-open': visible }" class="modal cursor-pointer">
      <div class="modal-box relative">
        <div class="alert alert-warning shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p>
              This action cannot be undone!
            </p>
          </div>
        </div>
        <p class="text font-semibold pt-4">
          Are you sure you want to delete this certificate?
        </p>
        <p class="text-lg font-extrabold text-center text-red-600 pt-2">
          {{ crt }}
        </p>
        <p class="text-xs pt-2">
          Of course you can re-create a certificate using the same name when it was deleted.
          In which also a new key is re-generated. Depending on CA certificate will be revoked before deletion.
        </p>
        <div class="modal-action">
          <button :disabled="(! $auth.loggedIn) || loading" class="btn btn-outline btn-error" @click="deleteCert()">
            Delete
          </button>
          <button :disabled="loading" for="del-modal" class="btn btn-outline btn-info normal-case" @click="visible=false; closeAlert()">
            Cancel
          </button>
        </div>
        <InfoMessage v-if="loading" :title="'Processing your request. Please wait!'" :spinner="true" class="mt-4">
          You will be redirected to chosen CA...
        </InfoMessage>
        <InfoMessage
          v-if="message.show"
          class="basis-full grow-0 mt-4"
          :title="message.title"
          :alert="true"
          :closable="true"
          @info-message-closed="closeAlert()"
        >
          <span><code>{{ message.text }}</code></span>
        </InfoMessage>
      </div>
    </div>
  </div>
</template>

<!-- nextTODO:
  PEM Viewer
-->

<script>
import _ from 'underscore'

export default {
  name: 'CaBrowse',
  data () {
    return {
      message: {
        title: '',
        text: '',
        show: false
      },
      visible: false,
      loading: false,
      clipboard: false,
      crt: null
    }
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const ca = String(route.params.ca)
    const caList = useCaList()
    const certs = useCertificates(ca)

    // unbekannte CA -> zurück zur Übersicht (wie bisher)
    watch(caList.status, (s) => {
      if (s === 'success' && !caList.data.value.some(c => c.id === ca)) router.replace('/browse')
    }, { immediate: true })

    return {
      ca,
      cas: caList.data,
      crts: certs.data,
      listLoading: computed(() => caList.loading.value || certs.loading.value),
      error: computed(() => caList.error.value || certs.error.value),
      refreshCrts: certs.refresh
    }
  },
  computed: {
    caById: function () { // eslint-disable-line
      return _.findWhere(this.cas, { id: this.ca })
    },
    caIsPublic: function () { // eslint-disable-line
      return this.caById?.type === 'public'
    },
  },
  mounted () {
    if (navigator.clipboard) {
      this.clipboard = true
    }
  },
  methods: {
    serialToHex: function (s) { // eslint-disable-line
      return BigInt(s).toString(16)
    },
    nameTrimDot: function (n) { // eslint-disable-line
      return n.replace(/\.?$/, '')
    },
    deleteModalHandler: function (i, n) { // eslint-disable-line
      this.crt = this.nameTrimDot(n)
      this.visible = true
    },
    async deleteCert () { // eslint-disable-line
      this.message.show = false
      this.loading = true
      try {
        await this.$api('/ca/' + this.ca + '/crt/' + this.crt, { method: 'DELETE' })
        this.visible = false
        await this.refreshCrts()
      } catch (e) {
        this.message.title = e?.status ? 'HTTP API returned an error!' : 'Ooops... Browser returned an error!'
        this.message.text = apiErrorText(e)
        this.message.show = true
      } finally {
        this.loading = false
      }
    },
    closeAlert: function () { // eslint-disable-line
      this.message.show = false
    },
    isCertLoaded: function (i) { // eslint-disable-line
      return this.crts[i].loaded
    },
    async getPEM (i, p) { // eslint-disable-line
      if (this.crts[i][p + 'Copied'] === undefined) {
        this.crts[i][p + 'Copied'] = null // https://v2.vuejs.org/v2/guide/list.html#Caveats
      }
      if (this.crts[i].loaded === undefined) {
        this.crts[i].loaded = false // https://v2.vuejs.org/v2/guide/list.html#Caveats
      }
      try {
        if (!this.crts[i].loaded) {
          this.crts[i].pem = await this.$api('/ca/' + this.ca + '/crt/' + this.crts[i].name + '/pem')
          this.crts[i].loaded = true
        }
        await navigator.clipboard.writeText(this.crts[i].pem[p])
        this.crts[i][p + 'Copied'] = true
        setTimeout(() => { this.crts[i][p + 'Copied'] = null }, 1300)
      } catch (e) {
        useNotification().notify('PEM konnte nicht geladen werden: ' + apiErrorText(e), 'error')
      }
    },
    // Download mit Token (ein einfacher Link würde ohne Anmeldung abgewiesen)
    async downloadPEM (c, type) {
      try {
        const pem = await this.$api('/ca/' + this.ca + '/crt/' + this.nameTrimDot(c.name) + '/pem/' + type, { responseType: 'text' })
        const url = URL.createObjectURL(new Blob([pem], { type: 'application/x-pem-file' }))
        const a = document.createElement('a')
        a.href = url
        a.download = this.nameTrimDot(c.name) + '.' + type + '.pem'
        a.click()
        URL.revokeObjectURL(url)
      } catch (e) {
        useNotification().notify('Download fehlgeschlagen: ' + apiErrorText(e), 'error')
      }
    },
    formatDate: function (d, o) { // eslint-disable-line
      return new Date(d).toLocaleString('de-DE', o ? o : { dateStyle: 'medium', timeStyle: 'medium' }) // eslint-disable-line
    },
    isValid: function (d) { // eslint-disable-line
      return new Date(d) > Date.now() // validTo > now
    },
    daysTTL: function (f, t) { // eslint-disable-line
      return Math.floor((new Date(t) - new Date(f)) / 1000 / 60 / 60 / 24)
    },
    daysLeft: function (d) { // eslint-disable-line
      return Math.floor((new Date(d) - Date.now()) / 1000 / 60 / 60 / 24)
    }
  }
}
</script>
