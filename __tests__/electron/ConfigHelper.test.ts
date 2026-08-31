import { describe, it, expect, vi, beforeEach } from 'vitest'

// We will test configuration methods by injecting/replacing fs behavior using vitest spies
// Since there's a global configHelper instance created on import, we should mock fs beforehand
vi.mock('node:fs', () => {
  let store: Record<string, string> = {
    '/mock/path/config.json': JSON.stringify({ language: 'python', apiKey: 'sk-12345678901234567890123456789012', opacity: 1.0 })
  };
  return {
    default: {
      existsSync: vi.fn((path) => path in store),
      readFileSync: vi.fn((path) => store[path as string]),
      writeFileSync: vi.fn((path, data) => { store[path as string] = data }),
      mkdirSync: vi.fn()
    },
    existsSync: vi.fn((path) => path in store),
    readFileSync: vi.fn((path) => store[path as string]),
    writeFileSync: vi.fn((path, data) => { store[path as string] = data }),
    mkdirSync: vi.fn()
  }
})

vi.mock('fs', async () => {
  const actual = await vi.importActual('node:fs');
  return actual;
})

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn().mockReturnValue('/mock/path'),
    isPackaged: true
  },
  dialog: {
    showMessageBox: vi.fn().mockResolvedValue({ response: 0 })
  },
  BrowserWindow: {
    getAllWindows: vi.fn().mockReturnValue([])
  },
  EventEmitter: class {}
}))

vi.mock('electron-log', () => {
  return {
    default: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn()
    }
  }
})

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ status: 200 }),
    post: vi.fn().mockResolvedValue({ status: 200, data: { choices: [{ message: { content: 'test' } }] } })
  }
}));

import { ConfigHelper } from '../../electron/ConfigHelper'

describe('ConfigHelper', () => {
  let configHelper: ConfigHelper;

  beforeEach(() => {
    vi.clearAllMocks();
    configHelper = new ConfigHelper();
  })

  it('should get configuration properly', () => {
    const config = configHelper.loadConfig();
    expect(config.language).toBe('python');
    expect(config.opacity).toBe(1.0);
  })

  it('should update configuration successfully', async () => {
    const newConfig = { language: 'javascript' };

    await configHelper.updateConfig(newConfig);
    const config = configHelper.loadConfig();
    expect(config.language).toBe('javascript');
  })

  it('should check if API key exists', async () => {
    // Test checkApiKey
    const hasKey = await configHelper.hasApiKey();
    expect(hasKey).toBe(true);
  })

  it('should get correct opacity', () => {
    expect(configHelper.getOpacity()).toBe(1.0);
  })

  it('should get current language', () => {
    // Note: since the file mocked above shares its mock store, earlier tests update it!
    // For this test, it should be javascript if run after the update
    const lang = configHelper.getLanguage();
    expect(['python', 'javascript']).toContain(lang);
  })
})
