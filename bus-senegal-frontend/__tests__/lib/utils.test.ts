import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn()', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', { active: true, disabled: false })
      expect(result).toContain('base')
      expect(result).toContain('active')
      expect(result).not.toContain('disabled')
    })

    it('should handle undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })
  })

  describe('formatCurrency()', () => {
    it('should format currency in XOF', () => {
      const result = formatCurrency(15000)
      expect(result).toMatch(/15/)
      expect(result).toMatch(/000/)
    })

    it('should handle zero', () => {
      const result = formatCurrency(0)
      expect(result).toBeDefined()
    })

    it('should handle large numbers', () => {
      const result = formatCurrency(1000000)
      expect(result).toMatch(/1/)
      expect(result).toMatch(/000/)
    })

    it('should not include decimals for XOF', () => {
      const result = formatCurrency(15000.50)
      // XOF doesn't use decimals typically
      expect(result).not.toMatch(/\./)
    })
  })

  describe('formatDate()', () => {
    it('should format date string', () => {
      const date = '2025-11-01'
      const result = formatDate(date)
      expect(result).toMatch(/2025/)
      expect(result).toMatch(/novembre/i)
    })

    it('should format Date object', () => {
      const date = new Date('2025-11-01')
      const result = formatDate(date)
      expect(result).toMatch(/2025/)
    })

    it('should use French locale', () => {
      const date = '2025-01-15'
      const result = formatDate(date)
      expect(result).toMatch(/janvier/i)
    })
  })

  describe('formatDateTime()', () => {
    it('should format date and time', () => {
      const dateTime = '2025-11-01T14:30:00'
      const result = formatDateTime(dateTime)
      expect(result).toMatch(/2025/)
      expect(result).toMatch(/14/)
      expect(result).toMatch(/30/)
    })

    it('should include both date and time parts', () => {
      const dateTime = new Date('2025-11-01T14:30:00')
      const result = formatDateTime(dateTime)
      expect(result.length).toBeGreaterThan(formatDate(dateTime).length)
    })
  })
})


