import packagejson from '@root/package.json';

const STORE_PROPERTY = 'api_recorder_store';

const initialState = {
  enable: true,
  dataCenter: 'APIRecorderDB',
  version: packagejson['version'],
  height: 0,
  rules: ['/api', '.json', '/admin', '/detail'],
};

/** 初始化本地存储 */
export const initStore = (): void => {
  if (!window.localStorage.getItem(STORE_PROPERTY)) {
    window.localStorage.setItem(STORE_PROPERTY, JSON.stringify(initialState));
  }
};

if(!window.localStorage.getItem(STORE_PROPERTY)) {
  initStore();
}

/**
 * 从本地存储中获取指定键对应的值
 * @param key - 存储中的键
 * @returns 返回键对应的值，如果不存在则返回undefined
 */
export const getFromStore = (key: string = undefined): any => {
  try {
    // 如果没有指定键，则返回整个存储对象
    if (!key) return JSON.parse(window.localStorage.getItem(STORE_PROPERTY) || '{}');
    // 从本地存储中获取存储对象
    const store = JSON.parse(window.localStorage.getItem(STORE_PROPERTY) || '{}');
    // 返回键对应的值
    return store[key];
  } catch (e) {
    // 如果出现异常则返回undefined
    return undefined;
  }
};

export const saveToStore = (key: string, value: unknown): void => {
  
  try {
    let store = JSON.parse(window.localStorage.getItem(STORE_PROPERTY) || '{}');
    store = { ...store, [key]: value };
  console.log('saveToStore', store);

    window.localStorage.setItem(STORE_PROPERTY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};
