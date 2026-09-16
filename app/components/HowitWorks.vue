<template>
  <div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">
        How it works?
      </h2>
      <div class="prose max-w-fit">
        <p>
          Large enterprises like Deutsche Telekom implements <em>DNS Split Horizon</em>
          by maintaining completely segregated infrastructure for their
          second level company domains.
        </p>
        <p>
          For ACME DNS-01 validation we delegate the <strong><em>public part</em></strong>
          of our <code>*.company.tld</code> domains to a public DNS provider like
          <a href="https://docs.otc.t-systems.com/dns/index.html">Open Telekom Cloud (OTC) DNS</a>
          service for instance.
        </p>
      </div>
      <div class="mockup-code">
        <pre class="px-5" data-prefix="[~]$"><code>dig +short @8.8.8.8 foo.company.tld NS
ns1.open-telekom-cloud.com.
ns2.open-telekom-cloud.com.</code></pre>
      </div>
      <div class="prose max-w-fit">
        <p>
          Because its authoritative with API support, we can automate the ACME DNS-01 validation
          for public CA.
        </p>
        <p>
          The X.509 <code>CommonName</code> of your certificate can be internally and externally the same.
          You can use public issued certificates internally without pain.
          Of course with respect to your threat model.
        </p>
        <p>
          <strong>AutoDNS</strong> is the facility to create proper DNS records for your certificate.
          You need an authoritative nameserver with API support for the
          <strong><em>internal part</em></strong> of your <code>*.company.tld</code> domains.
        </p>
      </div>
      <div class="card-actions justify-end" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowitWorks'
}
</script>
