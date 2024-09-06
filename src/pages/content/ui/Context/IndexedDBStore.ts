export default class IndexedDBStore<T> {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBDatabase>;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  public async setItem(key: string, value: T): Promise<void> {
    const db = await this.dbPromise;
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ id: key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getItem(key: string): Promise<T | undefined> {
    const db = await this.dbPromise;
    return new Promise<T | undefined>((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  public async removeItem(key: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
      console.log('removeItem', request);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async clear(): Promise<void> {

    const db = await this.dbPromise;
    
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
    console.log('clear', store,this.dbName,this.storeName);

      const request = store.clear();

      request.onsuccess = () => {resolve();

        console.log(`Successfully cleared object store: ${this.storeName}`);
      };
      request.onerror = () => {reject(request.error);

        console.error(`Error clearing object store: ${this.storeName}`);
      };

     
    });
  }

  public async delete(): Promise<void> {
    const db = await this.dbPromise;
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.delete(this.storeName);

     
      request.onsuccess = () => {resolve();

        console.log(`Successfully delete object store: ${this.storeName}`);
      };
      request.onerror = () => {reject(request.error);

        console.error(`Error delete object store: ${this.storeName}`);
      };

  })
}
}
