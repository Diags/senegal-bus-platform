import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('should apply default styles', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border')
  })

  it('should handle onChange event', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'Hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('should accept different input types', () => {
    const { rerender } = render(<Input type="text" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'text')
    
    rerender(<Input type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
    
    rerender(<Input type="password" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('should display placeholder text', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('should accept and display value', async () => {
    const user = userEvent.setup()
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement
    
    await user.type(input, 'Test value')
    expect(input.value).toBe('Test value')
  })

  it('should apply custom className', () => {
    render(<Input className="custom-class" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-class')
  })

  it('should support required attribute', () => {
    render(<Input required data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toBeRequired()
  })

  it('should support maxLength attribute', () => {
    render(<Input maxLength={10} data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('maxLength', '10')
  })
})

