import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SettingsDialog } from '../../src/components/Settings/SettingsDialog'
import { ToastContext } from '../../src/contexts/toast'

const mockShowToast = vi.fn()

const renderWithToast = (ui: React.ReactElement) => {
  return render(
    <ToastContext.Provider value={{ showToast: mockShowToast }}>
      {ui}
    </ToastContext.Provider>
  )
}

describe('SettingsDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // We mock window.electronAPI.getConfig
    window.electronAPI.getConfig = vi.fn().mockResolvedValue({
      apiKey: '',
      apiProvider: 'gemini',
      language: 'python'
    })
  })

  it('renders nothing when not open', () => {
    renderWithToast(<SettingsDialog open={false} onOpenChange={() => {}} />)
    expect(screen.queryByText(/API Settings/i)).not.toBeInTheDocument()
  })

  it('renders settings dialog when open', async () => {
    renderWithToast(<SettingsDialog open={true} onOpenChange={() => {}} />)

    // Since we mocked with no apiKey, it defaults to API Settings tab
    await waitFor(() => {
      expect(screen.getByText(/API Settings/i)).toBeInTheDocument()
    })

    // Test that the API provider selection is rendered
    expect(screen.getByText(/API Provider/i)).toBeInTheDocument()
    expect(screen.getByText(/OpenAI/i)).toBeInTheDocument()

    // There are multiple "Gemini" texts (title, models), so use getAllByText
    const geminiElements = screen.getAllByText(/Gemini/i)
    expect(geminiElements.length).toBeGreaterThan(0)
  })
})
