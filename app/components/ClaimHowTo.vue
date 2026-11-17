<template>
  <section id="tech-howto" class="overflow-hidden rounded-[16px] border border-[#ECE7EE] bg-white">
    <!-- Collapsed by default: reference material, not a prerequisite. -->
   <button
      type="button"
      class="flex w-full appearance-none items-center gap-3 border-0 bg-[#FAFBFE] px-5 py-4 text-left transition-colors hover:bg-[#F4F7FD]"
      :aria-expanded="open"
      @click="open = !open"
    >
      <!-- Outlined book, drawn inline so no icon package is required -->
      <span class="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF3FD]">
        <svg viewBox="0 0 24 24" fill="none" stroke="#2457C5" stroke-width="1.6"
             stroke-linecap="round" stroke-linejoin="round" class="size-4.5" aria-hidden="true">
          <path d="M4 19.5V5.5A1.5 1.5 0 0 1 5.5 4H18a1 1 0 0 1 1 1v13" />
          <path d="M6 17h13v3H6a2 2 0 0 1 0-4h13" />
        </svg>
      </span>

      <span class="flex flex-1 flex-col gap-0.5">
        <span class="text-[14.5px] font-bold text-[#12172B]">How to use your certificate</span>
        <span class="text-[12.5px] text-[#6B7085]">
          Fetch the PEM files, and let your app pick up renewals on its own
        </span>
      </span>

      <span class="flex items-center gap-1.5 text-[13px] font-medium text-[#2457C5]">
        {{ open ? 'Hide' : 'Show' }}
        <!-- Chevron turns instead of swapping the glyph -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round"
             class="size-4 transition-transform duration-200"
             :class="open ? 'rotate-180' : ''" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>

    <div v-if="open" class="flex flex-col gap-2.5 border-t border-[#F0EEF4] px-5 py-4">

      <!-- One article per step; only one is expanded at a time. -->
      <article
        v-for="s in steps"
        :key="s.n"
        class="rounded-[12px] border"
        :class="step === s.n ? 'border-[#D6E0F7] bg-[#FAFCFF]' : 'border-[#ECE7EE]'"
      >
        <div class="flex items-center gap-3 px-4 py-3">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold"
            :class="step === s.n ? 'bg-[#2457C5] text-white' : 'bg-[#EEF1F7] text-[#4B5063]'"
          >{{ s.n }}</span>

          <span class="flex flex-1 flex-col">
            <span class="text-[13.5px] font-bold text-[#12172B]">{{ s.title }}</span>
            <span class="text-[12px] text-[#4B5063]">{{ s.subtitle }}</span>
          </span>

          <!-- Shortcut back up to the form, only useful on the first step -->
          <button
            v-if="s.n === 1"
            type="button"
            class="appearance-none rounded-full border border-[#F3C9DC] bg-[#FDF2F7] px-3 py-1 text-[11.5px] font-bold text-[#C2185B] transition-colors hover:bg-[#FBE3EC]"
            @click.stop="emit('goToForm')"
          >
            Go to the claim form ↑
          </button>

          <button
            type="button"
            class="appearance-none rounded-full border-0 bg-transparent px-2 py-1 text-[15px] leading-none text-[#4B5063] transition-colors hover:bg-[#F3F2F7] hover:text-[#12172B]"
            :aria-label="step === s.n ? 'Collapse' : 'Expand'"
            @click="toggle(s.n)"
          >
            {{ step === s.n ? '×' : '+' }}
          </button>
        </div>

        <!-- ---------- Step 1 ---------- -->
        <div v-if="step === 1 && s.n === 1" class="flex flex-col gap-3 px-4 pb-4">
          <p class="text-[13px] text-[#2457C5]">
            Claim the certificate once. DNS3L solves the DNS-01 challenge and
            stores key and full chain for you.
          </p>
          <CodeTabs :tabs="step1" />
        </div>

        <!-- ---------- Step 2 ---------- -->
        <div v-if="step === 2 && s.n === 2" class="flex flex-col gap-3 px-4 pb-4">
          <p class="text-[13px] text-[#2B3044]">
            Your certificate can be fetched right away: download it in the UI or
            over the API.
          </p>

          <div class="flex flex-col gap-2 rounded-[10px] bg-[#EFF4FD] px-4 py-3 text-[12.5px] text-[#2B3044]">
            <p>
              <strong class="font-bold text-[#12172B]">In the UI:</strong>
              Certificate Authorities → your CA → the
              <strong class="font-bold">PEM</strong> column of the certificate.
            </p>
            <ul class="m-0 flex list-none flex-col gap-1 p-0">
              <li>
                <strong class="font-bold text-[#12172B]">Key</strong> downloads the
                private key → <code class="font-mono">key.pem</code>
              </li>
              <li>
                <strong class="font-bold text-[#12172B]">Fullchain</strong> your
                certificate plus intermediates → <code class="font-mono">fullchain.pem</code>
              </li>
              <li>
                The download icon writes the same file to disk. Keep
                <code class="font-mono">key.pem</code> private.
              </li>
            </ul>
          </div>

          <p class="text-[13px] text-[#2B3044]">Or via API and CLI, the same files:</p>
          <CodeTabs :tabs="step2" />
        </div>

        <!-- ---------- Step 3 ---------- -->
        <div v-if="step === 3 && s.n === 3" class="flex flex-col gap-3 px-4 pb-4">
          <p class="text-[13px] text-[#2B3044]">
            The app serves HTTPS with Express. It loads the PEM files at start and
            swaps in the renewed certificate on the fly, without a restart.
          </p>

          <div class="grid gap-3 md:grid-cols-2">
            <div class="flex flex-col gap-2 rounded-[10px] border border-[#DDE4F2] bg-white px-4 py-3">
              <span class="text-[11.5px] font-bold text-[#2457C5]">① Once: start with the PEM files</span>
              <p class="text-[12.5px] text-[#4B5063]">
                Express serves HTTPS with <code class="font-mono">key.pem</code> and
                <code class="font-mono">fullchain.pem</code> from step 2.
              </p>
              <pre class="overflow-x-auto rounded-[8px] bg-[#111726] px-3 py-2 font-mono text-[11px] text-[#D6DEF0]"><code>https.createServer({ key, cert }, app)
  .listen(443);</code></pre>
            </div>

            <div class="flex flex-col gap-2 rounded-[10px] border border-[#CBE7D6] bg-[#F5FBF7] px-4 py-3">
              <span class="text-[11.5px] font-bold text-[#17663A]">② Always: keep it fresh</span>
              <p class="text-[12.5px] text-[#2B3044]">
                DNS3L renews before expiry. Every few hours the app fetches the PEM,
                and if it changed it swaps it in with
                <code class="font-mono">server.setSecureContext()</code>. No restart,
                no downtime.
              </p>
              <p class="text-[12px] text-[#4B5063]">
                Same idea for Kubernetes, gateways or other stacks: fetch, compare,
                swap, reload.
              </p>
            </div>
          </div>

          <p class="text-[13px] font-bold text-[#12172B]">The script behind it:</p>
          <CodeTabs :tabs="step3" />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * "How to use your certificate" - a collapsed guide next to the claim form.
 *
 * It answers the question the form itself cannot: what to do with the key and
 * the full chain once they exist. Collapsed by default, so someone who already
 * knows does not have to scroll past it.
 *
 * Every snippet is built from the CA and the name currently entered in the
 * form, so the commands can be copied and run as they are. The CLI commands
 * follow dns3lcli (cli/root.go): `crt claim` and `crt pem` with -r for a
 * single resource.
 *
 * Plain markup on purpose - no icon component, no UI library - so the panel
 * renders in an air-gapped environment where an icon set may not be installed.
 */
const props = withDefaults(defineProps<{
  /** CA id currently selected in the form. */
  caId?: string
  /** FQDN currently entered, without the wildcard marker. */
  name?: string
}>(), { caId: '', name: '' })

const emit = defineEmits<{ goToForm: [] }>()

const open = ref(false)

/** Which step is expanded; 0 means none. One at a time keeps the panel short. */
const step = ref(1)
const toggle = (n: number) => { step.value = step.value === n ? 0 : n }

const steps = [
  { n: 1, title: 'Get your certificate', subtitle: 'Claim it in the form above, via API or CLI' },
  { n: 2, title: 'Bootstrap your application', subtitle: 'Fetch full chain and key once' },
  { n: 3, title: 'Example: Node.js web app', subtitle: 'One real case, from first start to auto-renewal' }
]

/** Base URL of the API, as configured for this deployment. */
const base = computed(() => String(useRuntimeConfig().public.apiURL || '/api/v1'))

// Placeholders keep the snippets readable before anything has been entered.
const ca = computed(() => props.caId || '<ca>')
const name = computed(() => props.name || 'bar.foo.company.tld')

const step1 = computed(() => [
  {
    label: 'curl',
    code: `# claim via API (alternative to the form)
curl -s -X POST ${base.value}/ca/${ca.value}/crt \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"${name.value}","wildcard":false}'`
  },
  {
    label: 'CLI',
    code: `# claim via dns3lcli
dns3lcli crt claim ${ca.value} ${name.value}

# with SANs, a wildcard or an AutoDNS A record:
dns3lcli crt claim ${ca.value} ${name.value} \\
  --san api.${name.value} --wildcard --autodns-ipv4 10.0.0.1`
  }
])

const step2 = computed(() => [
  {
    label: 'curl',
    code: `curl -s -H "Authorization: Bearer $TOKEN" \\
  ${base.value}/ca/${ca.value}/crt/${name.value}/pem/fullchain > fullchain.pem

curl -s -H "Authorization: Bearer $TOKEN" \\
  ${base.value}/ca/${ca.value}/crt/${name.value}/pem/key > key.pem`
  },
  {
    label: 'CLI',
    code: `dns3lcli crt pem ${ca.value} ${name.value} -r fullchain -o fullchain.pem
dns3lcli crt pem ${ca.value} ${name.value} -r key -o key.pem

# or write every PEM resource into one directory:
dns3lcli crt pem ${ca.value} ${name.value} --output-dir ./certs`
  }
])

const step3 = computed(() => [
  {
    label: 'Node.js',
    code: `// server.js
const https = require('node:https');
const fs = require('node:fs');
const BASE = '${base.value}/ca/${ca.value}/crt/${name.value}';
const AUTH = { Authorization: 'Bearer ' + process.env.DNS3L_TOKEN };
const tls = () => ({ key: fs.readFileSync('key.pem'), cert: fs.readFileSync('fullchain.pem') });
const server = https.createServer(tls(), app).listen(443);

// every 6 h: fetch, compare, swap without restart
const get = (p) => fetch(BASE + p, { headers: AUTH }).then((r) => r.text());
setInterval(async () => {
  const chain = await get('/pem/fullchain');
  if (chain === fs.readFileSync('fullchain.pem', 'utf8')) return;
  fs.writeFileSync('key.pem', await get('/pem/key'));
  fs.writeFileSync('fullchain.pem', chain);
  server.setSecureContext(tls());
}, 6 * 60 * 60 * 1000);`
  },
  {
    label: 'CLI',
    code: `# refresh.sh - same idea with dns3lcli, run by cron or a timer
set -eu
dns3lcli crt pem ${ca.value} ${name.value} -r fullchain -o fullchain.new
cmp -s fullchain.new fullchain.pem && { rm fullchain.new; exit 0; }

dns3lcli crt pem ${ca.value} ${name.value} -r key -o key.pem
mv fullchain.new fullchain.pem
systemctl reload my-app     # or: docker kill -s HUP my-app`
  }
])

/**
 * Lets the page open the guide from outside, for example from the success
 * dialog right after a claim. Defaults to step 2, which is the one that
 * explains how to fetch the files.
 */
function openStep(n = 2) {
  open.value = true
  step.value = n
}
defineExpose({ openStep })

</script>