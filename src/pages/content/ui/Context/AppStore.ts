import IndexedDBStore from './IndexedDBStore';
import { IState } from './useStore';
const DBNAME ='APIRecorderDB'

const DB_STORE_NAME = 'api_recorder_db_store';

export type API_MAP_TYPE = {
  [key: string]: {
    method: 'xhr' | 'fetch';
    enable_mock: boolean;
    enable_record: boolean;
    /**
     * 当前使用数据指向
     */
    current: number;
    responseHeaders: any;
    data: string[];
  } | unknown;
};

class IndexedDBStateStore {
  private store: IndexedDBStore<IState>;

  constructor(dbName: string, storeName: string) {
    this.store = new IndexedDBStore<IState>(dbName, storeName);
  }

  public async saveState(state: IState): Promise<void> {
    await this.store.setItem(DB_STORE_NAME, state);
  }

  public async loadState(): Promise<IState | undefined> {
    return this.store.getItem(DB_STORE_NAME);
  }

  public async removeState(): Promise<void> {
    await this.store.removeItem(DB_STORE_NAME);
  }

  public async clearAllStates(): Promise<void> {
    console.log('clearAllStates');

    await this.store.clear();
  }

  public deleteDB() {
    return this.store.delete();
  }
}

const stateStore = new IndexedDBStateStore(DBNAME, DB_STORE_NAME);

const AppStore = {
  save: async (state: IState) => stateStore.saveState(state),
  load: async () => stateStore.loadState(),
  clear: async () => stateStore.removeState(),
  delete: async () => stateStore.deleteDB(),

};

export default AppStore;

// 保存状态
// stateStore.saveState(myState);

// // 加载状态
// stateStore.loadState('MyAppStore').then(state => console.log(state));

// // 删除状态
// stateStore.removeState('MyAppStore');

// // 清空所有状态
// stateStore.clearAllStates();
