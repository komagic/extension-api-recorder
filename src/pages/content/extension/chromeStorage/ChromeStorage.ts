export default class ChromeStorage {
  static async set<T>(key: string, value: T): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  static async get<T>(key: string): Promise<T | undefined> {
    return new Promise(resolve => {
      chrome.storage.local.get([key], result => {
        resolve(result[key]);
      });
    });
  }

  static async remove(key: string): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.remove(key, () => {
        resolve();
      });
    });
  }

  static async clear(): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  }
}
