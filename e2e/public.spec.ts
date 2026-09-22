// Was jeder ohne Anmeldung sieht
import { test, expect } from '@playwright/test'
import { header, resetMock } from './helpers'

test.beforeEach(async ({ request }) => { await resetMock(request) })

test('Startseite mit Header, Inhalt und Footer', async ({ page }) => {
  await page.goto('/')
  await expect(header(page).getByRole('link', { name: 'CA', exact: true })).toBeVisible()
  await expect(header(page).getByRole('link', { name: 'API', exact: true })).toBeVisible()
  await expect(header(page).getByRole('link', { name: 'Claim', exact: true })).toHaveCount(0)
  await expect(page.getByText('X.509 for TLS')).toBeVisible()
  await expect(page.locator('footer')).toContainText('Backend: mock')
})

test('CA-Übersicht ist öffentlich, Details sind gesperrt', async ({ page }) => {
  await page.goto('/browse')
  await expect(page.getByText("Let's Encrypt")).toBeVisible()
  await expect(page.getByText('Step CA')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Browse...' }).first()).toHaveAttribute('disabled', 'true')
})

for (const path of ['/claim', '/tokens', '/browse/le']) {
  test(`geschützte Seite ${path} leitet ohne Login zur Startseite`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveURL('/')
  })
}

test('API-Dokumentation lädt ohne externe Quellen', async ({ page }) => {
  const external: string[] = []
  page.on('request', (r) => { if (!r.url().startsWith('http://localhost')) external.push(r.url()) })
  await page.goto('/swagger')
  await expect(page.locator('rapi-doc')).toContainText('DNS3L API', { timeout: 15_000 })
  expect(external).toEqual([])
})
