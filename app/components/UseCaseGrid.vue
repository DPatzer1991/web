<template>
  <!-- Ported from the final mockup (section#who-for), without its animations. -->
  <section
    id="who-for"
    class="mx-auto flex max-w-7xl flex-col gap-5.5 px-5.5 pb-5.5 pt-12.25"
  >
    <div class="flex flex-wrap items-end justify-between gap-3.5">
      <div class="flex flex-col gap-2">
        <span class="text-[13px] font-bold uppercase tracking-[0.06em] text-[#2457C5]">
          Who it's for 
        </span>
        <h2 class="m-0 text-[30px] font-extrabold leading-[1.1] tracking-[-0.035em] text-[#12172B]">
          Wherever your services talk <span class="text-[#2457C5]">TLS</span>.
        </h2>
      </div>
      <p class="m-0 max-w-95 text-[15px] leading-[1.55] text-[#4B5063]">
        From public portals to service-to-service mTLS: one claim, the right CA,
        automatic renewal.
      </p>
    </div>

    <div class="relative">
      <div class="relative grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3.5">

        <!-- ============ 01 Web applications ============ -->
        <div class="wf-card relative flex flex-col overflow-hidden rounded-[20px] border border-[#D6E2FA] bg-white text-[#12172B] shadow-[0_18px_36px_-30px_rgba(30,42,71,0.35)]">
          <span aria-hidden="true" class="absolute inset-x-0 top-0 h-0.75 bg-[linear-gradient(90deg,#2457C5,rgba(255,255,255,0))]" />

          <!-- A browser window with a public URL -->
          <div
            aria-hidden="true"
            class="relative flex h-37.5 items-center justify-center border-b border-[#D6E2FA] bg-[radial-gradient(80%_100%_at_50%_100%,#E6EEFC_0%,rgba(255,255,255,0)_75%)] px-4"
          >
            <span class="absolute left-3.5 top-3 font-mono text-[12px] font-medium text-[#2457C5]">01</span>
            <div class="w-full max-w-60 overflow-hidden rounded-[12px] border border-[#D6E2FA] bg-white shadow-[0_18px_34px_-20px_rgba(36,87,197,0.55)] transform-[perspective(600px)_rotateX(8deg)]">
              <div class="flex gap-1 bg-[#F3F7FE] px-2.25 py-1.75">
                <span class="size-1.75 rounded-full bg-[#FF5F57]" />
                <span class="size-1.75 rounded-full bg-[#FEBC2E]" />
                <span class="size-1.75 rounded-full bg-[#28C840]" />
              </div>
              <div class="flex items-center gap-1.5 px-2.5 py-2.25 font-mono text-[11.5px] text-[#12172B]">
                <span class="inline-flex rounded-[6px] bg-[#DDF4E6] p-0.75 text-[#17864A]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>
                <span class="flex-1 truncate">portal.example.com</span>
              </div>
              <div class="flex flex-col gap-1.25 px-2.5 pb-2.75">
                <span class="h-1.5 w-[70%] rounded-[9px] bg-[#E6EEFC]" />
                <span class="h-1.5 w-[45%] rounded-[9px] bg-[#EEF0F5]" />
              </div>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3.5">
            <span class="flex items-center gap-2.5">
              <span aria-hidden="true" class="flex size-8.5 flex-none items-center justify-center rounded-[10px] bg-[#E6EEFC] text-[#2457C5]">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M3 12h18" />
                  <path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" />
                </svg>
              </span>
              <span class="text-[17px] font-extrabold tracking-[-0.02em]">Web applications</span>
            </span>

            <span class="text-[14px] leading-[1.55] text-[#4B5063]">
              Trusted TLS for public-facing web apps and portals.
            </span>

            <div class="mt-auto flex flex-col items-start gap-1.5 border-t border-[#F1F2F6] pt-3 text-[12px]">
              <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E6EEFC] py-0.75 pl-2 pr-2.5 font-bold text-[#2457C5]">
                <span class="size-1.75 rounded-full bg-[#2457C5]" />Let's Encrypt
              </span>
              <span class="text-[#8A90A6]">e.g. portal, shop, docs</span>
            </div>
          </div>
        </div>

        <!-- ============ 02 Internal applications ============ -->
        <div class="wf-card relative flex flex-col overflow-hidden rounded-[20px] border border-[#E2DAF8] bg-white text-[#12172B] shadow-[0_18px_36px_-30px_rgba(30,42,71,0.35)]">
          <span aria-hidden="true" class="absolute inset-x-0 top-0 h-0.75 bg-[linear-gradient(90deg,#5B3BC2,rgba(255,255,255,0))]" />

          <!-- An internal name inside a dashed corp-network boundary -->
          <div
            aria-hidden="true"
            class="relative flex h-37.5 items-center justify-center border-b border-[#E2DAF8] bg-[radial-gradient(80%_100%_at_50%_100%,#EFEAFC_0%,rgba(255,255,255,0)_75%)] px-4"
          >
            <span class="absolute left-3.5 top-3 font-mono text-[12px] font-medium text-[#5B3BC2]">02</span>
            <div class="relative flex flex-col items-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-[#C8B8F2] bg-white/70 px-4.5 pb-3 pt-4">
              <span class="absolute -top-2.25 left-3 bg-[#F8F6FE] px-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#5B3BC2]">
                corp network
              </span>
              <div class="flex items-center gap-1.5 rounded-full border border-[#E2DAF8] bg-white px-2.75 py-1.75 font-mono text-[11.5px] text-[#12172B] shadow-[0_12px_26px_-16px_rgba(91,59,194,0.6)]">
                <span class="inline-flex text-[#5B3BC2]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>grafana.corp.internal
              </div>
              <span class="text-[10.5px] font-bold uppercase tracking-wider text-[#5B3BC2]">
                no public IP needed
              </span>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3.5">
            <span class="flex items-center gap-2.5">
              <span aria-hidden="true" class="flex size-8.5 flex-none items-center justify-center rounded-[10px] bg-[#EFEAFC] text-[#5B3BC2]">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
                </svg>
              </span>
              <span class="text-[17px] font-extrabold tracking-[-0.02em]">Internal applications</span>
            </span>

            <span class="text-[14px] leading-[1.55] text-[#4B5063]">
              Certificates for internal services, from a private CA if needed.
            </span>

            <div class="mt-auto flex flex-col items-start gap-1.5 border-t border-[#F1F2F6] pt-3 text-[12px]">
              <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#EFEAFC] py-0.75 pl-2 pr-2.5 font-bold text-[#5B3BC2]">
                <span class="size-1.75 rounded-full bg-[#5B3BC2]" />Jane Doe Internal CA
              </span>
              <span class="text-[#8A90A6]">e.g. wiki, grafana, vault</span>
            </div>
          </div>
        </div>

        <!-- ============ 03 Microservices ============ -->
        <div class="wf-card relative flex flex-col overflow-hidden rounded-[20px] border border-[#CDEBD8] bg-white text-[#12172B] shadow-[0_18px_36px_-30px_rgba(30,42,71,0.35)]">
          <span aria-hidden="true" class="absolute inset-x-0 top-0 h-0.75 bg-[linear-gradient(90deg,#17864A,rgba(255,255,255,0))]" />

          <!-- Two services with an mTLS link; the dots mark both endpoints -->
          <div
            aria-hidden="true"
            class="relative flex h-37.5 items-center justify-center border-b border-[#CDEBD8] bg-[radial-gradient(80%_100%_at_50%_100%,#E3F5EA_0%,rgba(255,255,255,0)_75%)] px-4"
          >
            <span class="absolute left-3.5 top-3 font-mono text-[12px] font-medium text-[#17864A]">03</span>
            <div class="flex items-center">
              <span class="rounded-[10px] border border-[#CDEBD8] bg-white px-2.75 py-2 font-mono text-[11.5px] text-[#12172B] shadow-[0_12px_24px_-16px_rgba(23,134,74,0.6)]">orders</span>
              <span class="relative h-0.5 w-19.5 bg-[#B9E3C9]">
                <span class="absolute -top-0.75 left-0 size-2 rounded-full bg-[#17864A]" />
                <span class="absolute -top-0.75 right-0 size-2 rounded-full bg-[#17864A]" />
                <span class="absolute left-1/2 -top-6 -translate-x-1/2 rounded-full bg-[#17864A] px-1.75 py-px text-[10px] font-extrabold text-white">mTLS</span>
              </span>
              <span class="rounded-[10px] border border-[#CDEBD8] bg-white px-2.75 py-2 font-mono text-[11.5px] text-[#12172B] shadow-[0_12px_24px_-16px_rgba(23,134,74,0.6)]">payments</span>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3.5">
            <span class="flex items-center gap-2.5">
              <span aria-hidden="true" class="flex size-[34px] flex-none items-center justify-center rounded-[10px] bg-[#E3F5EA] text-[#17864A]">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" />
                  <path d="M12 7.5v4" /><path d="m10.5 13-4 3" /><path d="m13.5 13 4 3" />
                </svg>
              </span>
              <span class="text-[17px] font-extrabold tracking-[-0.02em]">Microservices</span>
            </span>

            <span class="text-[14px] leading-[1.55] text-[#4B5063]">
              mTLS between services and platforms, renewed automatically.
            </span>

            <div class="mt-auto flex flex-col items-start gap-1.5 border-t border-[#F1F2F6] pt-3 text-[12px]">
              <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E3F5EA] py-[3px] pl-2 pr-2.5 font-bold text-[#17864A]">
                <span class="size-[7px] rounded-full bg-[#17864A]" />Jane Doe Internal CA
              </span>
              <span class="text-[#8A90A6]">e.g. orders, payments, auth</span>
            </div>
          </div>
        </div>

        <!-- ============ 04 APIs ============ -->
        <div class="wf-card relative flex flex-col overflow-hidden rounded-[20px] border border-[#F8CDE3] bg-white text-[#12172B] shadow-[0_18px_36px_-30px_rgba(30,42,71,0.35)]">
          <span aria-hidden="true" class="absolute inset-x-0 top-0 h-0.75 bg-[linear-gradient(90deg,#C2006A,rgba(255,255,255,0))]" />

          <!-- A request answered over TLS 1.3 -->
          <div
            aria-hidden="true"
            class="relative flex h-37.5 items-center justify-center border-b border-[#F8CDE3] bg-[radial-gradient(80%_100%_at_50%_100%,#FDE7F2_0%,rgba(255,255,255,0)_75%)] px-4"
          >
            <span class="absolute left-3.5 top-3 font-mono text-[12px] font-medium text-[#C2006A]">04</span>
            <div class="w-full max-w-60 rounded-[12px] border border-[#F8CDE3] bg-white px-3 py-2.75 font-mono text-[11.5px] leading-[1.75] text-[#12172B] shadow-[0_18px_34px_-20px_rgba(226,0,116,0.45)]">
              <div>
                <span class="text-[#8A90A6]">$</span> curl <span class="text-[#C2006A]">/v1/orders</span>
                <span class="ml-0.75 inline-block h-3.25 w-1.75 bg-[#E20074] align-[-2px]" />
              </div>
              <div class="flex items-center gap-1.5">
                <span class="inline-flex text-[#17864A]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>
                <span class="text-[#6B7085]">TLS 1.3</span>
                <span class="ml-auto rounded-[5px] bg-[#DDF4E6] px-1.5 text-[#17663A]">200 OK</span>
              </div>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3.5">
            <span class="flex items-center gap-2.5">
              <span aria-hidden="true" class="flex size-8.5 flex-none items-center justify-center rounded-[10px] bg-[#FDE7F2] text-[#C2006A]">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" />
                </svg>
              </span>
              <span class="text-[17px] font-extrabold tracking-[-0.02em]">APIs</span>
            </span>

            <span class="text-[14px] leading-[1.55] text-[#4B5063]">
              Secure communication between backend systems and partners.
            </span>

            <div class="mt-auto flex flex-col items-start gap-1.5 border-t border-[#F1F2F6] pt-3 text-[12px]">
              <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FDE7F2] py-0.75 pl-2 pr-2.5 font-bold text-[#C2006A]">
                <span class="size-1.75 rounded-full bg-[#C2006A]" />TeleSec
              </span>
              <span class="text-[#8A90A6]">e.g. partner and B2B APIs</span>
            </div>
          </div>
        </div>
      </div>

      <!-- The same three moves, whichever card you came from -->
      <div class="relative mt-4.5 flex flex-wrap items-center justify-center gap-x-4.5 gap-y-2 text-[13px] font-bold text-[#2B3044]">
        <span class="inline-flex items-center gap-2">
          <span class="inline-flex size-5.5 items-center justify-center rounded-full bg-[#E20074] text-[11px] font-extrabold text-white">1</span>One claim
        </span>
        <span aria-hidden="true" class="h-px w-7 bg-[#C9DAF7]" />
        <span class="inline-flex items-center gap-2">
          <span class="inline-flex size-5.5 items-center justify-center rounded-full bg-[#2457C5] text-[11px] font-extrabold text-white">2</span>The right CA
        </span>
        <span aria-hidden="true" class="h-px w-7 bg-[#C9DAF7]" />
        <span class="inline-flex items-center gap-2">
          <span class="inline-flex size-5.5 items-center justify-center rounded-full bg-[#17864A] text-[11px] font-extrabold text-white">3</span>Automatic renewal
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * "Who it's for" - four audiences, each with a small illustration of what
 * their traffic looks like.
 *
 * Ported from the final mockup (section#who-for), with its animations left
 * out: the pulsing lock, the packets travelling along the mTLS line and the
 * blinking terminal cursor are static here. Nothing moves on the page.
 *
 * The illustrations are markup rather than images: nothing to ship in
 * public/, and they scale with the font size.
 *
 * The CA names in the pills are the mockup's example data. To show the CAs an
 * installation really has, resolve them from useCaList() by visibility -
 * public for cards 1 and 4, private for 2 and 3 - and leave the pill out when
 * there is no match.
 */
</script>

<style scoped>
/* The only state change left: a slightly deeper shadow under the pointer. */
.wf-card {
  transition: box-shadow .25s ease, border-color .25s ease;
}
.wf-card:hover {
  box-shadow: 0 28px 46px -28px rgba(30, 42, 71, .45);
}
@media (prefers-reduced-motion: reduce) {
  .wf-card { transition: none; }
}
</style>