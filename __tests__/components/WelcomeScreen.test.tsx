import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WelcomeScreen } from '../../src/components/WelcomeScreen'

describe('WelcomeScreen', () => {
  it('renders welcome message properly', () => {
    const onOpenSettings = vi.fn()
    render(<WelcomeScreen onOpenSettings={onOpenSettings} />)

    // Test that the title or welcome text appears
    expect(screen.getByText(/Welcome to Interview Coder/i)).toBeInTheDocument()
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument()
  })

  it('calls onOpenSettings when button is clicked', () => {
    const onOpenSettings = vi.fn()
    render(<WelcomeScreen onOpenSettings={onOpenSettings} />)

    const settingsButton = screen.getByRole('button', { name: /Open Settings/i })
    fireEvent.click(settingsButton)

    expect(onOpenSettings).toHaveBeenCalledTimes(1)
  })
})
