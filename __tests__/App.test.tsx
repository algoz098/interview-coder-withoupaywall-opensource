import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../src/App'

// Hoist mock
vi.mock('../src/_pages/SubscribedApp', () => {
  return {
    default: () => <div data-testid="subscribed-app">Subscribed App Mock</div>
  }
})

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.electronAPI.checkApiKey = vi.fn().mockResolvedValue(true)
    window.electronAPI.getConfig = vi.fn().mockResolvedValue({
      apiKey: 'sk-mock',
      apiProvider: 'gemini',
      language: 'python'
    })

    // Add missing mocks for UpdateNotification component
    window.electronAPI.onUpdateAvailable = vi.fn().mockReturnValue(() => {})
    window.electronAPI.onUpdateDownloaded = vi.fn().mockReturnValue(() => {})
    window.electronAPI.onUpdateError = vi.fn().mockReturnValue(() => {})
    window.electronAPI.onUpdateProgress = vi.fn().mockReturnValue(() => {})

    // Add missing mock for SubscribedApp
    window.electronAPI.onOcrState = vi.fn().mockReturnValue(() => {})
    window.electronAPI.onOcrResult = vi.fn().mockReturnValue(() => {})
    window.electronAPI.onOcrError = vi.fn().mockReturnValue(() => {})
  })

  it('initializes and renders SubscribedApp when initialized and has API key', async () => {
    render(<App />)

    // It should first show Initializing...
    expect(screen.getByText(/Initializing/i)).toBeInTheDocument()

    // Then it should resolve and render SubscribedApp
    await waitFor(() => {
      expect(screen.getByTestId('subscribed-app')).toBeInTheDocument()
    })
  })

  it('renders WelcomeScreen when no API key is present', async () => {
    // Mock to return false for checking API key
    window.electronAPI.checkApiKey = vi.fn().mockResolvedValue(false)
    window.electronAPI.getConfig = vi.fn().mockResolvedValue({
      apiKey: '',
      apiProvider: 'gemini',
      language: 'python'
    })

    render(<App />)

    // It should resolve and render WelcomeScreen text
    await waitFor(() => {
      expect(screen.getByText(/Welcome to Interview Coder/i)).toBeInTheDocument()
    })
  })
})
