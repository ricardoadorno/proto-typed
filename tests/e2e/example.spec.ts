import { test, expect } from '@playwright/test'

test.describe('Proto-Typed Web App', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Proto-Typed/)
  })

  test('should navigate to docs', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Documentation')
    await expect(page).toHaveURL(/\/docs/)
  })
})
