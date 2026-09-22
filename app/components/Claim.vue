<template>
  <div class="card max-w-xl bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">
        <span v-if="isCaACME || !ca">Claim your certificate</span>
        <span v-else>Generate your CSR</span>
      </h2>
      <div class="form-control grid grid-cols-2 gap-2">
        <div class="col-span-2">
          <div class="tooltip tooltip-right" data-tip="Available CAs for issueing">
            <label class="label gap-2">
              <span class="label-text">Certificate Authority</span>
              <CaBadges v-if="ca" :type="isCaPublic ? 'public' : 'private'" :acme="isCaACME" />
            </label>
          </div>
          <select
            id="ca"
            v-model="ca"
            name="ca"
            class="select select-bordered w-full"
            :class="{ 'border-rose-600': errors.ca, 'border-2': errors.ca }"
          >
            <option disabled value="null">
              Please select one
            </option>
            <option v-for="c in cas" :key="c.id" :disabled="!c.enabled" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>
        <div>
          <div class="tooltip tooltip-right" data-tip="Hostname prefix. FQDN is prefix + suffix.">
            <label class="label"><span class="label-text">FQDN Prefix</span></label>
          </div>
          <input
            id="prefix"
            ref="prefix"
            v-model.trim="prefix"
            name="prefix"
            type="text"
            placeholder="x5c.foobar"
            class="input input-bordered w-full"
            :class="{ 'border-rose-600': errors.prefix, 'border-2': errors.prefix }"
          >
        </div>
        <div>
          <div class="tooltip" data-tip="Allowed domain suffixes.">
            <label class="label"><span class="label-text">Domain Suffix</span></label>
          </div>
          <select
            id="rtz"
            v-model="rtz"
            name="rtz"
            class="select select-bordered w-full"
            :class="{ 'border-rose-600': errors.rtz, 'border-2': errors.rtz }"
            @change="disableAutoDNS()"
          >
            <option disabled value="null">
              Please select one
            </option>
            <option v-for="r in rtzn" :key="r.root" :value="r.root">
              {{ r.root }}
            </option>
          </select>
        </div>
        <div>
          <div class="tooltip tooltip-right" data-tip="An optional list of DNS: subject alternative names. SAN is suffixed with the choosen domain suffix.">
            <label class="label"><span class="label-text">Optional SAN</span></label>
          </div>
          <input
            id="san"
            v-model.trim="san"
            name="san"
            type="text"
            placeholder="SAN, .., SAN"
            class="input input-bordered w-full"
            :class="{ 'border-rose-600': errors.san, 'border-2': errors.san }"
          >
        </div>
        <div>
          <div class="tooltip" data-tip="An IP for AutoDNS A record creation. AutoDNS for SAN is currently not supported.">
            <label class="label"><span class="label-text">Optional IP</span></label>
          </div>
          <input
            id="ip"
            v-model.trim="ip"
            name="ip"
            type="text"
            :disabled="! autodns"
            placeholder="10.1.20.3"
            class="input input-bordered w-full"
            :class="{ 'border-rose-600': errors.ip, 'border-2': errors.ip }"
          >
        </div>
        <div>
          <label class="label cursor-pointer">
            <div class="tooltip tooltip-right" data-tip="Create a wildcard for the FQDN.">
              <span class="label-text">Wildcard</span>
            </div>
            <input v-model="wildcard" type="checkbox" class="checkbox checkbox-sm" @click="disableAutoDNS()"></input>
          </label>
        </div>
        <div>
          <label class="label cursor-pointer">
            <div class="tooltip text-right" data-tip="Create a forward record for none wildcard FQDN.">
              <span class="label-text">AutoDNS</span>
            </div>
            <input v-model="autodns" type="checkbox" :disabled="!isRootAutoDNS || wildcard" class="checkbox checkbox-sm"></input>
          </label>
        </div>
      </div>
      <div class="card-actions justify-end">
        <CertButton
          v-if="isCaACME || !ca"
          class="mt-2"
          :loading="loading"
          @claim-cert="sendForm()"
        />
        <CertButton
          v-else
          class="mt-2"
          :disabled="true"
          :label="'Get Your CSR'"
          :loading="loading"
          @claim-cert="sendForm()"
        />
        <button :disabled="loading" class="flex-none btn btn-primary mt-2 normal-case text-slate-50 text-l" @click="resetForm()">
          Reset
        </button>
      </div>

      <InfoMessage v-if="loading" :title="'Processing your request. Please wait!'" :spinner="true" class="mt-2">
        You will be redirected to chosen CA...
      </InfoMessage>
      <InfoMessage
        v-if="message.show"
        class="basis-full grow-0 mt-2"
        :title="message.title"
        :alert="true"
        :closable="true"
        @info-message-closed="closeAlert()"
      >
        <span><code>{{ message.text }}</code></span>
      </InfoMessage>
    </div>
  </div>
</template>

<!-- nextTODO:
  Disable CA | RTZ based on Selection
-->

<script>
import _ from 'underscore'
export default {
  name: 'ClaimCert',
  setup () {
    const { data: cas } = useCaList()
    const { data: rtzn } = useRootZones()
    return { cas, rtzn }
  },
  data () {
    return {
      message: {
        title: '',
        text: '',
        show: false
      },
      loading: false,
      errors: {
        rtz: false,
        ca: false,
        prefix: false,
        san: false,
        ip: false
      },
      rtz: null,
      ca: null,
      prefix: null,
      san: null,
      ip: null,
      wildcard: false,
      autodns: false
    }
  },
  computed: {
    isCaACME: function () { // eslint-disable-line
      return !this.ca ? false : _.findWhere(this.cas, { id: this.ca }).acme
    },
    isCaPublic: function () { // eslint-disable-line
      return !this.ca ? false : _.findWhere(this.cas, { id: this.ca }).type === 'public'
    },
    isRootACME: function () { // eslint-disable-line
      return !this.rtz ? true : _.findWhere(this.rtzn, { root: this.rtz }).acmedns
    },
    isRootAutoDNS: function () { // eslint-disable-line
      return !this.rtz ? true : _.findWhere(this.rtzn, { root: this.rtz }).autodns
    }
  },
  mounted () {
    this.focusInput()
  },
  methods: {
    focusInput () { // eslint-disable-line
      this.$refs.prefix.focus({ preventScroll: true })
    },
    checkPrefix: function (p) { // eslint-disable-line
      // RFC 1123, https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
      const hostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/
      return p ? p.match(hostnameRegex) != null : false // mandatory
    },
    checkIP: function (i) { // eslint-disable-line
      const ipAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
      return i ? i.match(ipAddressRegex) != null : (!this.autodns) // AutoDNS mandatory
    },
    checkSAN: function (s) { // eslint-disable-line
      if (!s) { return true } // optional
      const sans = s.split(/\s?,\s?/)
      // RFC 1123 with optional *. prefix
      const hostnameRegex = /^(\*\.)?(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/
      for (const p of sans) {
        if (p.match(hostnameRegex) == null) { return false }
      }
      return true
    },
    checkForm: function () { // eslint-disable-line
      let failures = 0
      for (const i in this.errors) { this.errors[i] = false }
      if (!this.ca) { failures++; this.errors.ca = true }
      if (!this.rtz) { failures++; this.errors.rtz = true }
      if (!this.prefix) { failures++; this.errors.prefix = true }
      if (!this.checkPrefix(this.prefix)) { failures++; this.errors.prefix = true }
      if (!this.checkSAN(this.san)) { failures++; this.errors.san = true }
      if (!this.checkIP(this.ip)) { failures++; this.errors.ip = true }
      return !failures
    },
    async sendForm () { // eslint-disable-line
      const body = {
        name: this.prefix + '.' + this.rtz,
        wildcard: this.wildcard,
        san: this.san ? this.san.split(/\s?,\s?/).map(s => s + '.' + this.rtz) : null,
        autodns: this.autodns && this.ip ? { ipv4: this.ip } : null
      }
      if (this.checkForm()) {
        this.message.show = false
        this.loading = true
        try {
          await this.$api('/ca/' + this.ca + '/crt', { method: 'POST', body })
          this.$router.push('/browse/' + this.ca) // browse CA
        } catch (e) {
          this.message.title = e?.status ? 'HTTP API returned an error!' : 'Ooops... Browser returned an error!'
          this.message.text = apiErrorText(e)
          this.message.show = true
        } finally {
          this.loading = false
        }
      }
    },
    resetForm: function () { // eslint-disable-line
      this.loading = false
      this.message.show = false
      for (const i in this.errors) { this.errors[i] = null }
      this.rtz = null
      this.ca = null
      this.prefix = null
      this.san = null
      this.ip = null
      this.wildcard = false
      this.autodns = false
      this.focusInput()
    },
    disableAutoDNS: function () { // eslint-disable-line
      if (!this.wildcard) {
        this.autodns = false
        this.ip = null
      }
    },
    closeAlert: function () { // eslint-disable-line
      this.message.show = false
    }
  }
}
</script>
