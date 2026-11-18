<template>
  <!-- Section head plus step 1 of three. Ported from the final mockup
       (section#tech-problem). The steps carry no vertical padding between
       them, so the rail on the left runs through without a break. -->
  <section
    id="tech-problem"
    aria-labelledby="tech-problem-title"
    class="mx-auto flex max-w-7xl flex-col gap-5.5 px-5.5 pt-8.25"
  >
    <div class="flex flex-col gap-2">
      <span class="text-[13px] font-bold uppercase tracking-[0.06em] text-[#2457C5]">
        Why DNS3L - in three steps
      </span>
      <h2
        id="tech-problem-title"
        class="m-0 text-[clamp(23px,2.8vw,26px)] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#12172B] text-balance"
      >
        You need a certificate for your service.
        <span class="text-[#2457C5]">That should not take hours or days.</span>
      </h2>
    </div>

    <div class="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-0">
      <!-- Rail: numbered dot, then a line that fills the rest of the row -->
      <div aria-hidden="true" class="flex flex-col items-center">
        <span class="flex size-9 items-center justify-center rounded-full bg-[#2457C5] text-[15px] font-extrabold text-white shadow-[0_0_0_4px_#DCE6FB]">1</span>
        <span class="mt-2 w-0.5 flex-1 rounded-[2px] bg-[#DCE6FB]" />
      </div>

      <div class="flex min-w-0 flex-col gap-3 pb-8.5">
        <div class="flex flex-col gap-1 pt-1">
          <span class="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#6B7085]">Why mTLS</span>
          <h3 class="m-0 text-[20px] font-extrabold tracking-[-0.02em] text-[#12172B]">
            Every service proves who it is.
            <span class="text-[#2457C5]">With a certificate from DNS3L.</span>
          </h3>
          <span class="text-[14px] text-[#4B5063]">Same call between two services, three levels of trust.</span>
        </div>

        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-3">
          <div
            v-for="d in diagrams"
            :key="d.title"
            class="flex flex-col gap-2.5 rounded-[14px] border border-[#E6EAF2] bg-white p-4"
          >
            <div class="flex items-center justify-between gap-2">
              <strong class="text-[15px] text-[#12172B]">{{ d.title }}</strong>
              <span class="whitespace-nowrap rounded-full px-2.25 py-0.5 text-[11.5px] font-bold" :class="d.badgeClass">
                {{ d.badge }}
              </span>
            </div>

            <svg
              viewBox="0 0 320 132" width="100%" role="img" :aria-label="d.title"
              class="block rounded-[10px] bg-[#F7F9FD]"
              v-html="d.svg"
            />

            <span class="text-[13px] leading-normal text-[#4B5063]">{{ d.text }}</span>
          </div>
        </div>

        <!-- Footnote: where the certificates in those diagrams come from -->
        <div class="flex flex-wrap items-center gap-x-5.5 gap-y-3.5 rounded-[16px] border border-[#C9DAF7] bg-[#F3F7FE] px-4 py-3.5">
          <span class="flex-[1_1_300px] text-[14px] leading-[1.55] text-[#2B3044]">
            <strong class="text-[#12172B]">Where do these certificates come from?</strong>
            DNS3L issues one per service, delivers key and full chain from a fixed
            endpoint and renews it before it expires.
          </span>

          <div aria-hidden="true" class="flex flex-[0_1_auto] items-center gap-2 text-[13px] font-bold text-[#12172B]">
            <span class="rounded-[12px] border border-[#D6DBE7] bg-white px-3 py-2">Client service</span>
            <span class="flex flex-col items-center text-[11px] text-[#17663A]">
              cert
              <svg width="44" height="10" viewBox="0 0 44 10" fill="none" stroke="#17864A"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M42 5H3" /><path d="m7 1-4 4 4 4" />
              </svg>
            </span>
            <span class="rounded-[12px] bg-navy-800 px-3 py-2 text-white">
              DNS<span class="align-super text-[10px] text-[#E20074]">3L</span>
            </span>
            <span class="flex flex-col items-center text-[11px] text-[#17663A]">
              cert
              <svg width="44" height="10" viewBox="0 0 44 10" fill="none" stroke="#17864A"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 5h39" /><path d="m37 1 4 4-4 4" />
              </svg>
            </span>
            <span class="rounded-[12px] border border-[#D6DBE7] bg-white px-3 py-2">Server service</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Step 1 of three: why every service needs an identity of its own.
 *
 * This component also carries the heading of the whole section, because it
 * comes first. Steps 2 and 3 live in WhyNow.vue and ProblemSolution.vue and
 * continue the same rail - which is why none of the three adds vertical
 * padding between the rows.
 *
 * The drawings are the mockup's own SVG, kept verbatim so the rendering
 * matches: the double arrow for mTLS, the question mark for the unknown
 * caller, the "certs from DNS3L" pill. All markup here is authored in this
 * file, never user input, which is why v-html is safe.
 */
const clientBox = '<rect x="14" y="38" width="86" height="58" rx="12" fill="#FFFFFF" stroke="#D6DBE7"></rect><text x="57" y="63" text-anchor="middle" font-size="12" font-weight="700" fill="#12172B">Client</text><text x="57" y="80" text-anchor="middle" font-size="10" fill="#6B7085">service</text>'
const serverBox = '<rect x="220" y="38" width="86" height="58" rx="12" fill="#FFFFFF" stroke="#D6DBE7"></rect><text x="263" y="63" text-anchor="middle" font-size="12" font-weight="700" fill="#12172B">Server</text><text x="263" y="80" text-anchor="middle" font-size="10" fill="#6B7085">service</text>'

/** Check badge sitting on top of a box. */
const check = (x: number, color: string) =>
  `<g transform="translate(${x},26)"><rect width="30" height="22" rx="5" fill="${color}"></rect><path d="M8 11.5l4 4 8-8" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></g>`

/** Padlock on the connection line. */
const lock = (y: number, color: string) =>
  `<g transform="translate(151,${y})"><rect x="0" y="7" width="18" height="14" rx="3" fill="${color}"></rect><path d="M4 7V4.5a5 5 0 0 1 10 0V7" fill="none" stroke="${color}" stroke-width="2.4"></path></g>`

const diagrams = [
  {
    title: 'Without TLS',
    badge: 'Readable',
    badgeClass: 'bg-[#F7DDE2] text-[#A3122B]',
    text: 'Anyone on the network can read or change the data. No proof who is on the other side.',
    svg: `<g>${clientBox}</g><g>${serverBox}</g>`
      + '<line x1="100" y1="67" x2="220" y2="67" stroke="#A3122B" stroke-width="2" stroke-dasharray="5 4"></line>'
      + '<rect x="112" y="54" width="96" height="24" rx="6" fill="#FFFFFF" stroke="#F1C7CF"></rect>'
      + '<text x="160" y="70" text-anchor="middle" font-size="10" fill="#A3122B" style="font-family: ui-monospace, monospace">pw=secret123</text>'
      + '<g transform="translate(146,92)"><circle cx="14" cy="14" r="14" fill="#F7DDE2"></circle><path d="M5 14s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" fill="none" stroke="#A3122B" stroke-width="1.8"></path><circle cx="14" cy="14" r="2.6" fill="#A3122B"></circle></g>'
      + '<text x="160" y="22" text-anchor="middle" font-size="10.5" font-weight="700" fill="#A3122B">plain text</text>'
  },
  {
    title: 'With TLS',
    badge: 'Server verified',
    badgeClass: 'bg-[#E6EEFC] text-[#1A4F8A]',
    text: 'Traffic is encrypted and the client knows the server. The server still does not know who is calling.',
    svg: `<g>${clientBox}</g><g>${serverBox}${check(282, '#2457C5')}</g>`
      + '<line x1="100" y1="67" x2="220" y2="67" stroke="#2457C5" stroke-width="2.5"></line>'
      + lock(46, '#2457C5')
      + '<text x="160" y="96" text-anchor="middle" font-size="10" fill="#1A4F8A">encrypted</text>'
      + '<g transform="translate(30,100)"><circle cx="12" cy="12" r="11" fill="#EEF0F5"></circle><text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="800" fill="#8A90A6">?</text></g>'
      + '<text x="62" y="116" font-size="10" fill="#6B7085">who is calling?</text>'
      + '<text x="160" y="22" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1A4F8A">server shows a certificate</text>'
  },
  {
    title: 'With mTLS',
    badge: 'Both verified',
    badgeClass: 'bg-[#DDF4E6] text-[#17663A]',
    text: 'Both services prove their identity with a certificate from DNS3L. Only trusted services talk to each other: zero trust.',
    svg: `<g>${clientBox}${check(76, '#17864A')}</g><g>${serverBox}${check(282, '#17864A')}</g>`
      + '<line x1="100" y1="62" x2="220" y2="62" stroke="#17864A" stroke-width="2.5"></line>'
      + '<line x1="100" y1="72" x2="220" y2="72" stroke="#17864A" stroke-width="2.5"></line>'
      + '<path d="M206 56l8 6-8 6" fill="none" stroke="#17864A" stroke-width="2.2"></path>'
      + '<path d="M114 66l-8 6 8 6" fill="none" stroke="#17864A" stroke-width="2.2"></path>'
      + lock(36, '#17864A')
      + '<text x="160" y="96" text-anchor="middle" font-size="10" fill="#17663A">encrypted + both verified</text>'
      + '<text x="160" y="22" text-anchor="middle" font-size="10.5" font-weight="700" fill="#17663A">both show a certificate</text>'
      + '<g transform="translate(110,104)"><rect width="100" height="20" rx="10" fill="#DDF4E6"></rect><text x="50" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="#17663A">certs from DNS3L</text></g>'
  }
]
</script>