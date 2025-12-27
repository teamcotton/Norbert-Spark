import { expect, test } from '@playwright/test'

test('homepage has title and heading', async ({ page }) => {
  await page.goto('/')

  // Expect the page to have the correct title
  await expect(page).toHaveTitle(/Norbert's Spark/)

  // Expect to see the main heading
  await expect(page.locator('h1')).toContainText("Norbert's Spark")
})
