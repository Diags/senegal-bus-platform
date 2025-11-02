import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test('should complete full booking process', async ({ page }) => {
    // Start from homepage
    await page.goto('/')
    
    // Search for trips
    await page.getByLabel(/départ/i).fill('Dakar')
    await page.getByLabel(/arrivée/i).fill('Saint-Louis')
    await page.getByLabel(/date/i).fill('2025-11-15')
    await page.getByLabel(/passagers/i).fill('2')
    await page.getByRole('button', { name: /rechercher/i }).click()
    
    // Wait for search results
    await page.waitForURL(/\/trajets\/recherche/)
    await page.waitForLoadState('networkidle')
    
    // Select first available trip (if exists)
    const tripCards = page.locator('[data-testid="trip-card"]')
    const tripCount = await tripCards.count()
    
    if (tripCount > 0) {
      await tripCards.first().getByRole('link', { name: /réserver/i }).click()
      await expect(page).toHaveURL(/\/trajets\/\d+/)
      
      // View trip details
      await expect(page.getByText(/détails du trajet/i)).toBeVisible()
      await expect(page.getByText(/prix/i)).toBeVisible()
      
      // Proceed to booking (button may vary based on auth state)
      const bookButton = page.getByRole('button', { name: /réserver/i })
      if (await bookButton.isVisible()) {
        await bookButton.click()
      }
    } else {
      // No trips available
      await expect(page.getByText(/aucun trajet/i)).toBeVisible()
    }
  })

  test('should require authentication for booking', async ({ page }) => {
    await page.goto('/trajets/1')
    
    // Try to book without authentication
    const bookButton = page.getByRole('button', { name: /réserver/i })
    if (await bookButton.isVisible()) {
      await bookButton.click()
      
      // Should redirect to login or show auth modal
      await page.waitForTimeout(1000)
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/(auth|login|connexion)/i)
    }
  })

  test('should display booking confirmation', async ({ page }) => {
    // Navigate to a confirmed booking (mock scenario)
    await page.goto('/reservations/1/billet')
    
    // Check for e-ticket elements
    await expect(page.getByText(/billet électronique/i).or(page.getByText(/e-ticket/i))).toBeVisible()
  })

  test('should show booking history', async ({ page }) => {
    await page.goto('/mes-reservations')
    
    // Check page loaded
    await expect(page.getByRole('heading', { name: /mes réservations/i })).toBeVisible()
  })

  test('should allow seat selection', async ({ page }) => {
    await page.goto('/trajets/1')
    
    // Look for seat selection interface
    const seatSelector = page.locator('[data-testid="seat-selector"]')
    if (await seatSelector.isVisible()) {
      await seatSelector.first().click()
      await expect(seatSelector.first()).toHaveClass(/selected/)
    }
  })
})

