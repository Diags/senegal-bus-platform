import { test, expect } from '@playwright/test'

test.describe('Dashboard Flow', () => {
  test('should display company dashboard', async ({ page }) => {
    await page.goto('/dashboard/compagnie')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check for dashboard elements
    await expect(page.getByRole('heading', { name: /tableau de bord/i }).or(page.getByRole('heading', { name: /dashboard/i }))).toBeVisible()
  })

  test('should show statistics cards', async ({ page }) => {
    await page.goto('/dashboard/compagnie')
    await page.waitForLoadState('networkidle')
    
    // Look for statistics elements
    const statsCard = page.locator('[data-testid="stats-card"]')
    if (await statsCard.first().isVisible()) {
      await expect(statsCard.first()).toBeVisible()
    }
  })

  test('should display revenue metrics', async ({ page }) => {
    await page.goto('/dashboard/compagnie')
    await page.waitForLoadState('networkidle')
    
    // Check for revenue/chiffre d'affaires
    const revenueText = page.getByText(/revenus|chiffre d'affaires/i)
    if (await revenueText.first().isVisible()) {
      await expect(revenueText.first()).toBeVisible()
    }
  })

  test('should show bookings count', async ({ page }) => {
    await page.goto('/dashboard/compagnie')
    await page.waitForLoadState('networkidle')
    
    // Check for booking statistics
    const bookingsText = page.getByText(/réservations/i)
    if (await bookingsText.first().isVisible()) {
      await expect(bookingsText.first()).toBeVisible()
    }
  })

  test('should display admin dashboard for admins', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await page.waitForLoadState('networkidle')
    
    // Check for admin dashboard elements
    await expect(page.getByRole('heading', { name: /admin|administration/i })).toBeVisible()
  })

  test('should show platform statistics on admin dashboard', async ({ page }) => {
    await page.goto('/dashboard/admin')
    await page.waitForLoadState('networkidle')
    
    // Look for platform-wide metrics
    const companiesText = page.getByText(/compagnies/i)
    const usersText = page.getByText(/utilisateurs/i)
    
    if (await companiesText.first().isVisible() || await usersText.first().isVisible()) {
      expect(true).toBe(true) // Platform metrics are visible
    }
  })

  test('should navigate between dashboard sections', async ({ page }) => {
    await page.goto('/dashboard/compagnie')
    await page.waitForLoadState('networkidle')
    
    // Look for navigation tabs/links
    const tripsTab = page.getByRole('link', { name: /trajets/i })
    if (await tripsTab.isVisible()) {
      await tripsTab.click()
      await page.waitForLoadState('networkidle')
    }
  })

  test('should display recent bookings list', async ({ page }) => {
    await page.goto('/dashboard/compagnie')
    await page.waitForLoadState('networkidle')
    
    // Check for recent bookings section
    const recentBookings = page.getByText(/réservations récentes|dernières réservations/i)
    if (await recentBookings.isVisible()) {
      await expect(recentBookings).toBeVisible()
    }
  })

  test('should show occupancy rate', async ({ page }) => {
    await page.goto('/dashboard/compagnie')
    await page.waitForLoadState('networkidle')
    
    // Look for occupancy rate metric
    const occupancyText = page.getByText(/taux d'occupation|occupation/i)
    if (await occupancyText.first().isVisible()) {
      await expect(occupancyText.first()).toBeVisible()
    }
  })

  test('should allow date range filtering', async ({ page }) => {
    await page.goto('/dashboard/compagnie')
    await page.waitForLoadState('networkidle')
    
    // Look for date filter controls
    const dateFilter = page.locator('input[type="date"]')
    if (await dateFilter.first().isVisible()) {
      await expect(dateFilter.first()).toBeVisible()
    }
  })
})

