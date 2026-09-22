// End-to-End-Tests gegen die gebaute App mit Mock-Backend und Mock-Login.
// Start: yarn test:e2e  (baut die App und startet sie auf Port 3100)
import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT ?? 3100)
const BASE_URL = `http://localhost:${PORT}`

// Alpine (z. B. unser Devcontainer) wird von Playwrights eigenen Browsern nicht
// unterstützt. Dort den System-Chromium verwenden (apk add chromium).
// Überschreibbar mit CHROMIUM_PATH=/pfad/zum/chromium
const chromiumPath = process.env.CHROMIUM_PATH
  ?? (existsSync('/etc/alpine-release')
    ? ['/usr/bin/chromium-browser', '/usr/bin/chromium'].find(p => existsSync(p))
    : undefined)

export default defineConfig({
  testDir: './e2e',
  // Alle Tests teilen sich das In-Memory-Mock-Backend -> nacheinander ausführen
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read', 'clipboard-write'],
        launchOptions: {
          // Docker/Devcontainer: /dev/shm ist oft nur 64 MB -> Tabs stürzen sonst ab
          args: ['--disable-dev-shm-usage'],
          ...(chromiumPath ? { executablePath: chromiumPath } : {})
        }
      }
    }
  ],
  webServer: {
    // setzt einen vorherigen "nuxt build" voraus (erledigt yarn test:e2e)
    command: 'node .output/server/index.mjs',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      PORT: String(PORT),
      NUXT_PUBLIC_API_URL: `${BASE_URL}/mock`,
      NUXT_PUBLIC_MOCK_AUTH: 'true'
    }
  }
})
