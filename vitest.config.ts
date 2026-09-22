// Unit-Tests: laufen in einer echten Nuxt-Umgebung (Auto-Imports, Plugins, Runtime-Config)
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: ['test/unit/**/*.test.ts'],
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
        overrides: {
          runtimeConfig: {
            public: {
              apiURL: '/api',   // Anfragen gehen an registerEndpoint() im Test
              mockAuth: true    // Login ohne Dex
            }
          }
        }
      }
    }
  }
})
