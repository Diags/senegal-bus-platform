import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Components', () => {
  it('should render Card component', () => {
    render(<Card data-testid="card">Card Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card')
  })

  it('should render CardHeader component', () => {
    render(<CardHeader data-testid="card-header">Header Content</CardHeader>)
    const header = screen.getByTestId('card-header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex', 'flex-col', 'p-6')
  })

  it('should render CardTitle component', () => {
    render(<CardTitle>Test Title</CardTitle>)
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('Test Title')
    expect(title).toHaveClass('text-2xl', 'font-semibold')
  })

  it('should render CardDescription component', () => {
    render(<CardDescription>Test Description</CardDescription>)
    const description = screen.getByText('Test Description')
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('should render CardContent component', () => {
    render(<CardContent data-testid="card-content">Content</CardContent>)
    const content = screen.getByTestId('card-content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('p-6', 'pt-0')
  })

  it('should render CardFooter component', () => {
    render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>)
    const footer = screen.getByTestId('card-footer')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
  })

  it('should render complete Card with all subcomponents', () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content Here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId('full-card')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Card Title')
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Card Content Here')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
  })

  it('should apply custom className to Card', () => {
    render(<Card className="custom-class" data-testid="custom-card">Content</Card>)
    const card = screen.getByTestId('custom-card')
    expect(card).toHaveClass('custom-class')
  })
})

