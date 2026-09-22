// Zertifikate: ansehen, kopieren, herunterladen, löschen, beantragen
import { readFileSync } from 'node:fs'
import { test, expect } from '@playwright/test'
import { certRows, header, login, resetMock } from './helpers'

test.beforeEach(async ({ page, request }) => {
  await resetMock(request)
  await page.goto('/')
  await login(page)
})

// Hinweis: Die Startseite enthält ebenfalls ein Claim-Formular (#ca, #prefix, …).
// Deshalb erst auf /claim warten, bevor Felder ausgefüllt werden.
const openClaim = async (page) => {
  await header(page).getByRole('link', { name: 'Claim', exact: true }).click()
  await expect(page).toHaveURL('/claim')
  await expect(page.locator('#ca option[value="le"]')).toBeAttached()
}

const openLetsEncrypt = async (page) => {
  await header(page).getByRole('link', { name: 'CA', exact: true }).click()
  await page.getByRole('link', { name: 'Browse...' }).first().click()
  await expect(page).toHaveURL('/browse/le')
  await expect(certRows(page)).toHaveCount(3)
}

test('CA öffnen zeigt die Zertifikate', async ({ page }) => {
  await openLetsEncrypt(page)
  await expect(certRows(page).first()).toContainText('app.example.com')
})

test('Key in die Zwischenablage kopieren', async ({ page }) => {
  await openLetsEncrypt(page)
  const row = certRows(page).first()
  await row.getByRole('button', { name: 'Key' }).click()
  await expect(row.locator('.badge.visible', { hasText: 'Copied!' })).toBeVisible()
  const clip = await page.evaluate(() => navigator.clipboard.readText())
  expect(clip).toContain('BEGIN PRIVATE KEY')
})

test('Fullchain herunterladen (mit Token)', async ({ page }) => {
  await openLetsEncrypt(page)
  const download = page.waitForEvent('download')
  await certRows(page).first().getByTitle('Fullchain herunterladen').click()
  const file = await download
  expect(file.suggestedFilename()).toBe('app.example.com.fullchain.pem')
  expect(readFileSync(await file.path(), 'utf8')).toContain('BEGIN CERTIFICATE')
})

test('Zertifikat löschen', async ({ page }) => {
  await openLetsEncrypt(page)
  await certRows(page).first().getByRole('button', { name: 'Delete' }).click()
  await page.locator('.modal-action').getByRole('button', { name: 'Delete' }).click()
  await expect(certRows(page)).toHaveCount(2)
  await expect(page.locator('.modal-open')).toHaveCount(0)
  await expect(page.locator('tbody')).not.toContainText('app.example.com')
})

test('Claim: vorhandenes Zertifikat wird mit Fehlermeldung abgelehnt', async ({ page }) => {
  await openClaim(page)
  await page.locator('#ca').selectOption('le')
  await page.locator('#prefix').fill('api')
  await page.locator('#rtz').selectOption('example.com.')
  await page.getByRole('button', { name: 'Get Your Certificate' }).first().click()
  await expect(page.getByText('409 Conflict [Certificate already exists]')).toBeVisible()
  await expect(page).toHaveURL('/claim')
})

test('Claim: neues Zertifikat wird angelegt', async ({ page }) => {
  await openClaim(page)
  await page.locator('#ca').selectOption('le')
  await page.locator('#prefix').fill('neu')
  await page.locator('#rtz').selectOption('example.com.')
  await page.getByRole('button', { name: 'Get Your Certificate' }).first().click()
  await expect(page).toHaveURL('/browse/le', { timeout: 10_000 })
  await expect(certRows(page)).toHaveCount(4)
  await expect(page.locator('tbody')).toContainText('neu.example.com')
})

test('unbekannte CA leitet zur Übersicht', async ({ page }) => {
  await page.goto('/browse/gibtsnicht')
  await expect(page).toHaveURL('/browse')
})