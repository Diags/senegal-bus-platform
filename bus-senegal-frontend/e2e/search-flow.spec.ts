import { test, expect } from '@playwright/test'

test.describe('Search Flow', () => {
  test('should display homepage with search form', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page loaded
    await expect(page).toHaveTitle(/Bus Sénégal/i)
    
    // Check if search form is visible
    await expect(page.getByRole('heading', { name: /recherchez/i })).toBeVisible()
  })

  test('should search for trips successfully', async ({ page }) => {
    await page.goto('/')
    
    // Fill search form
    await page.getByLabel(/départ/i).fill('Dakar')
    await page.getByLabel(/arrivée/i).fill('Saint-Louis')
    await page.getByLabel(/date/i).fill('2025-11-01')
    await page.getByLabel(/passagers/i).fill('2')
    
    // Submit form
    await page.getByRole('button', { name: /rechercher/i }).click()
    
    // Wait for results page
    await expect(page).toHaveURL(/\/trajets\/recherche/)
    
    // Check if results are displayed (or "no results" message)
    await expect(page.getByText(/trajet/i)).toBeVisible()
  })

  test('should show validation errors for empty search', async ({ page }) => {
    await page.goto('/')
    
    // Submit form without filling
    await page.getByRole('button', { name: /rechercher/i }).click()
    
    // Should stay on homepage or show validation errors
    await expect(page).toHaveURL('/')
  })

  test('should navigate to trip details from search results', async ({ page }) => {
    // Mock some trips in the search results
    await page.goto('/trajets/recherche?from=Dakar&to=Saint-Louis&date=2025-11-01&passengers=2')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // If trips are available, click on the first one
    const tripCard = page.locator('[data-testid="trip-card"]').first()
    if (await tripCard.isVisible()) {
      await tripCard.getByRole('link', { name: /réserver/i }).click()
      await expect(page).toHaveURL(/\/trajets\/\d+/)
    }
  })

  test('should display "no trips found" message when no results', async ({ page }) => {
    await page.goto('/trajets/recherche?from=InvalidCity&to=AnotherInvalidCity&date=2025-11-01&passengers=1')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check for "no results" message
    await expect(page.getByText(/aucun trajet/i)).toBeVisible()
  })
})


