import { describe, it, expect, vi, beforeEach } from 'vitest'

// We must use `vi.hoisted` to share state inside vi.mock when it executes during import hoisting
const { storeState, resetStore } = vi.hoisted(() => {
  const initialState = {
    '/mock/path/config.json': JSON.stringify({ language: 'python', apiKey: 'sk-12345678901234567890123456789012', opacity: 1.0 })
  };

  let store: Record<string, string> = { ...initialState };

  return {
    storeState: () => store,
    resetStore: () => {
      store = { ...initialState };
    }
  }
});


vi.mock('electron-store', () => {
  return {
    default: class MockStore {
      store: any = {};
      get(key: string) { return this.store[key]; }
      set(key: string, value: any) { this.store[key] = value; }
    }
  }
});

vi.mock('node:fs', () => {
  return {
    default: {
      existsSync: vi.fn((path) => path in storeState()),
      readFileSync: vi.fn((path) => storeState()[path as string]),
      writeFileSync: vi.fn((path, data) => { storeState()[path as string] = data }),
      mkdirSync: vi.fn()
    },
    existsSync: vi.fn((path) => path in storeState()),
    readFileSync: vi.fn((path) => storeState()[path as string]),
    writeFileSync: vi.fn((path, data) => { storeState()[path as string] = data }),
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
    isPackaged: true,
    name: 'interview-coder-v1'
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
    resetStore(); // Fix: reset the store to pristine state before every test
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
    // With state reset, this should now deterministically return 'python'
    const lang = configHelper.getLanguage();
    expect(lang).toBe('python');
  })
})
