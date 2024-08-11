import packagejson from '@src/../package.json';

import { IStore, IAPIConfig } from './storeType';

class StoreStorage {
  private storeName = 'APIRECORDER';
  public storeData: IStore;
  public version;
  private interval = 2000;
  constructor() {
    this.init();
  }

  async addResponse(path: string, response: string): Promise<void> {
    const storeData: IStore = this.storeData;
    if (!storeData) return;
    const { store } = storeData;

    if (!store[path]) {
      store[path] = {
        url: path,
        enable_record: true,
        enable_mock: false,
        data: [response],
      };
    } else {
      // 保证每个 path 最多存储 3 条 response
      store[path].data.push(response);
      while (store[path].data.length > 3) {
        store[path].data.shift(); // 移除最早的一条 response
      }
    }
    this.set(storeData);
  }

  async init() {
    this.storeData = (await this.get()) || this.initialStoreData();
    console.log('storeData', this.storeData);

    this.startAutoSync(this.interval);
  }

  initialStoreData() {
    return {
      version: packagejson.version,
      store: {},
      enable: true,
      storeName: this.storeName,
    } as IStore;
  }

  async set<T>(obj: T): Promise<boolean> {
    return new Promise(resolve => {
      chrome.storage.local.set({ [this.storeName]: obj }, () => {
        resolve(true);
      });
    });
  }

  async get<T>(): Promise<T | undefined> {
    return new Promise(resolve => {
      chrome.storage.local.get([this.storeName], result => {
        resolve(result[this.storeName]);
      });
    });
  }

  //   static async remove(key: string): Promise<void> {
  //     return new Promise((resolve) => {
  //       chrome.storage.local.remove(key, () => {
  //         resolve();
  //       });
  //     });
  //   }

  async clear(): Promise<boolean> {
    return new Promise(resolve => {
      chrome.storage.local.remove(this.storeName, () => {
        resolve(true);
      });
    });
  }

  async syncToStorage(): Promise<void> {
    if (this.storeData) {
      return new Promise(resolve => {
        chrome.storage.local.set({ [this.storeName]: this.storeData }, () => {
          resolve();
        });
      });
    }
  }

  startAutoSync(interval: number): void {
    setInterval(async () => {
      try {
        await this.syncToStorage();
      } catch (error) {
        console.error('Error in auto-synchronization:', error);
      }
    }, interval);
  }
  //   static async clear(): Promise<void> {
  //     return new Promise((resolve) => {
  //       chrome.storage.local.clear(() => {
  //         resolve();
  //       });
  //     });
  //   }
}

export default StoreStorage;
