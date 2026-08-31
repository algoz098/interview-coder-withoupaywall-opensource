import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Electron API
global.window.electronAPI = {
  getCredits: vi.fn(),
  getConfig: vi.fn().mockResolvedValue({}),
  updateConfig: vi.fn(),
  checkApiKey: vi.fn().mockResolvedValue(true),
  onUpdateCredits: vi.fn(),
  onShowSettings: vi.fn().mockReturnValue(() => {}),
  onApiKeyInvalid: vi.fn().mockReturnValue(() => {}),
  onSolutionSuccess: vi.fn().mockReturnValue(() => {}),
  removeListener: vi.fn(),
  log: vi.fn(),
  openExternal: vi.fn(),
  captureScreenshot: vi.fn(),
  processImage: vi.fn(),
  generateSolution: vi.fn(),
  debugSolution: vi.fn(),
  openShortcutsDialog: vi.fn(),
  onOcrState: vi.fn().mockReturnValue(() => {}),
  onOcrResult: vi.fn().mockReturnValue(() => {}),
  onOcrError: vi.fn().mockReturnValue(() => {}),
  onSolutionState: vi.fn().mockReturnValue(() => {}),
  onSolutionResult: vi.fn().mockReturnValue(() => {}),
  onSolutionError: vi.fn().mockReturnValue(() => {}),
  onDebugState: vi.fn().mockReturnValue(() => {}),
  onDebugResult: vi.fn().mockReturnValue(() => {}),
  onDebugError: vi.fn().mockReturnValue(() => {}),
} as any

// Set up globals
global.window.__CREDITS__ = 999
global.window.__LANGUAGE__ = 'python'
global.window.__IS_INITIALIZED__ = true

// Provide matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
