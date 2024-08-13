import IndexedDBStore from './IndexedDBStore';

const STORE_NAME = 'apirecorder';

export type API_MAP_TYPE = {
  [key: string]: {
    method: 'xhr' | 'fetch';
    enable_mock: boolean;
    enable_record: boolean;
    current: number;
    data: string[];
  };
};

export interface IState {
  version: string;
  store_name: string;
  enable: boolean;
  apis_map: API_MAP_TYPE;
}
class IndexedDBStateStore {
  private store: IndexedDBStore<IState>;

  constructor(dbName: string, storeName: string) {
    this.store = new IndexedDBStore<IState>(dbName, storeName);
  }

  public async saveState(state: IState): Promise<void> {
    await this.store.setItem(STORE_NAME, state);
  }

  public async loadState(): Promise<IState | undefined> {
    return this.store.getItem(STORE_NAME);
  }

  public async removeState(): Promise<void> {
    await this.store.removeItem(STORE_NAME);
  }

  public async clearAllStates(): Promise<void> {
    await this.store.clear();
  }
}

const stateStore = new IndexedDBStateStore('MyStateDatabase', STORE_NAME);

const AppStore = {
  save: async (state: IState) => stateStore.saveState(state),
  load: async () => stateStore.loadState(),
  clear: async () => stateStore.removeState(),
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
