import Store from "electron-store"

interface ModelCacheItem {
  id: string;
  name: string;
  description: string;
  supportsVision: boolean;
}

interface StoreSchema {
  modelsCache?: {
    [provider: string]: {
      timestamp: number;
      models: ModelCacheItem[];
    }
  }
}

const store = new Store<StoreSchema>({
  name: "interview-coder-config",
  defaults: {},
  encryptionKey: "your-encryption-key"
}) as Store<StoreSchema> & {
  store: StoreSchema
  get: <K extends keyof StoreSchema>(key: K) => StoreSchema[K]
  set: <K extends keyof StoreSchema>(key: K, value: StoreSchema[K]) => void
}

export { store }
