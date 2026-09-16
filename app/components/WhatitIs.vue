<template>
  <div class="card lg:card-side bg-slate-50 shadow-xl">
    <div class="lg:w-1/2 bg-cover bg-center" style="background-image: url('/image.jpg')">
      <p class="mt-4 text-center text-4xl font-bold text-white">
        X.509 for TLS
      </p>
      <p class="mb-4 text-center text-xl font-bold text-white">
        Air gapped | Supporting (public) ACME CAS
      </p>
    </div>
    <div class="lg:w-1/2 card-body">
      <div class="prose max-w-none">
        <p class="font-bold">
          A central X.509 certificate claiming and renewal system for air-gapped environments focused on TLS and ACME via DNS-01 validation.
        </p>
        <p>
          Public ACME CA's are supported to mitigate your burden of dealing with private root chains. StepCA based private ACME CA is there to probably satisfy your threat model.<br />
          Claim a cert once and forget about it. The system ensures renewal. Let your application poll for updates and deploy renewed certs.
        </p>
        <blockquote>
          In general it is an attempt to facilitate a pattern change in application development. Regarding (m)TLS automation.<br />
          Stop asking: Who is organizing and managing X.509 for my app? I need it to configure my app.<br />
          Start asking: Where is the endpoint from where my app can always retrieve valid X.509?
        </blockquote>
      </div>
      <div class="card-actions mt-4">
        <NuxtLink to="/claim">
          <CertButton />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WhatitIs'
}
</script>
