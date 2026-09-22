import { expect, type Page, type APIRequestContext } from '@playwright/test'

// Mock-Backend auf Ausgangszustand zurücksetzen
export const resetMock = async (request: APIRequestContext) => {
  const res = await request.post('/mock/_reset')
  expect(res.ok()).toBeTruthy()
}

export const header = (page: Page) => page.locator('header')

// Mock-Login über den Button im Header
export const login = async (page: Page) => {
  await header(page).getByRole('button', { name: 'Login' }).click()
  await expect(header(page).getByRole('button', { name: 'Mock User' })).toBeVisible()
}

export const logout = async (page: Page) => {
  await header(page).getByRole('button', { name: 'Mock User' }).click()
  await expect(header(page).getByRole('button', { name: 'Login' })).toBeVisible()
}

export const certRows = (page: Page) => page.locator('tbody tr')
