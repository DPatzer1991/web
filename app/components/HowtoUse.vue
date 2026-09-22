<template>
  <div class="card w-96 min-w-full bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">
        How to use?
      </h2>
      <div class="divide-y">
        <div tabindex="0" class="collapse collapse-plus">
          <div class="collapse-title text-xl font-medium">
            Get your certificate
          </div>
          <div class="collapse-content focus:pointer-events-none">
            <div class="prose max-w-fit">
              <p>
                Obtain your certificate via CLI, <a :href="$config.public.apiURL" target="_blank">API</a> or filling out the web form. You just need to do this once.
                After a minute your certificate is issued and browsable under the CA's you choosed.
              </p>
            </div>
            <!-- interactive elements like nuxt-link not working inside this accordion collapse approach...
            <NuxtLink to="/claim" :disabled="(! $auth.loggedIn) || undefined" class="btn btn-primary mt-4 normal-case text-slate-50 text-l">
              Get Your Cert
            </NuxtLink>
            -->
          </div>
        </div>
        <div tabindex="0" class="collapse collapse-plus">
          <div class="collapse-title text-xl font-medium">
            Bootstrap your application
          </div>
          <div class="collapse-content">
            <div class="prose max-w-fit">
              <p>
                Your certificate can be retrieved now to bootstrap your application.
              </p>
            </div>
            <div class="mockup-code mt-2">
              <pre class="px-5" data-prefix="[~]$"><code>curl -s {{$config.public.apiURL}}/ca/{caId}/crt/bar.foo.company.tld/pem/fullchain > fullchain.pem</code></pre>
              <pre class="px-5" data-prefix="[~]$"><code>curl -s {{$config.public.apiURL}}/ca/{caId}/crt/bar.foo.company.tld/pem/key > key.pem</code></pre>
            </div>
          </div>
        </div>
        <div tabindex="0" class="collapse collapse-plus">
          <div class="collapse-title text-xl font-medium">
            Poll for updates
          </div>
          <div class="collapse-content">
            <div class="prose max-w-fit">
              <p>
                Your application polls DNS3L regularly for a newer one.
                If your cert was renewed your application can deploy it.
              </p>
            </div>
            <div class="mockup-code mt-2">
              <pre class="px-5" data-prefix="[~]$"><code class="text-success"># check your actual cert</code></pre>
              <pre class="px-5" data-prefix="[~]$"><code>echo | openssl s_client -servername bar.foo.company.tld \
        -connect bar.foo.company.tld:443 2>/dev/null |\
        openssl x509 -noout -dates | grep ^notAfter
</code>
</pre>
              <pre class="px-5" data-prefix="[~]$"><code class="text-success"># poll DNS3L regularly for a newer one</code></pre>
              <pre class="px-5" data-prefix="[~]$"><code>curl -s {{$config.public.apiURL}}/ca/{caId}/crt/bar.foo.company.tld/pem/crt |\
        openssl x509 -noout -dates | grep ^notAfter
</code>
</pre>
              <pre class="px-5" data-prefix="[~]$"><code class="text-success"># deploy a renewed one</code></pre>
              <pre class="px-5" data-prefix="[~]$"><code>curl -s {{$config.public.apiURL}}/ca/{caId}/crt/bar.foo.company.tld/pem/fullchain > fullchain.pem</code></pre>
              <pre class="px-5" data-prefix="[~]$"><code>curl -s {{$config.public.apiURL}}/ca/{caId}/crt/bar.foo.company.tld/pem/key > key.pem</code></pre>
            </div>
          </div>
        </div>
      </div>
      <p class="prose max-w-fit">
        The snippets are just to explain the pattern.
      </p>
      <div class="card-actions justify-end" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowtoUse',
  methods: {
    greet (event) {
      alert('Hello ' + this.name + '!')
      if (event) { alert(event.target.tagName) }
    }

  }
}
</script>
