import { defineNuxtConfig } from 'nuxt/config'
import pkg from './package.json'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'rapi-doc'
    }
  },
  app: {
    head: {
      title: 'DNS3L',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  runtimeConfig: {
    public: {
      appVersion: pkg.version,
      baseURL: 'http://localhost:3000',
      apiURL: 'http://localhost:3000/api',
      mockURL: 'http://localhost:3000/mock',
      authURL: '', // leer = <origin>/auth/.well-known/openid-configuration (Ingress)
      clientId: 'dns3l-app',
      daemonClientId: 'dns3ld',
      mockAuth: false,
      specURL: '/openapi.yaml' // API-Beschreibung für /swagger
    }
  }
})