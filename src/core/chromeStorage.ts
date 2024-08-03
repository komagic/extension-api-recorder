type StorageType = 'sync' | 'local';
type StoreObject = { [key: string]: unknown };
class ChromeStorage {
  private storage: chrome.storage.StorageArea;

  constructor(storageType: StorageType = 'local') {
    this.storage = storageType === 'local' ? chrome.storage.local : chrome.storage.sync;
  }

  // 设置数据
  set(object: StoreObject): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.set(object, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  // 获取数据
  get(keys: string | string[] | StoreObject | null = null): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
      this.storage.get(keys, items => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(items);
        }
      });
    });
  }

  // 删除数据
  remove(keys: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.remove(keys, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  // 清空存储
  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }
}

export default ChromeStorage;
