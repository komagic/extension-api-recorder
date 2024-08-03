import { useState } from 'react';

const STORE_PROPERTY = 'rq-devtools';

/**
 * 从本地存储中获取指定键对应的值
 * @param key - 存储中的键
 * @returns 返回键对应的值，如果不存在则返回undefined
 */
const getFromStore = (key: string): string => {
  try {
    // 从本地存储中获取存储对象
    const store = JSON.parse(window.localStorage.getItem(STORE_PROPERTY) || '{}');
    // 返回键对应的值
    return store[key];
  } catch (e) {
    // 如果出现异常则返回undefined
    return undefined;
  }
};

const saveToStore = (key: string, value: string): void => {
  try {
    let store = JSON.parse(window.localStorage.getItem(STORE_PROPERTY) || '{}');
    store = { ...store, [key]: value };
    window.localStorage.setItem(STORE_PROPERTY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

type SetValueAndSaveAction = (val: string) => void;

const useLocalStorageState = <T>(key: string, initialValue: T): [T, SetValueAndSaveAction] => {
  const valueFromStore = getFromStore(key);
  const [value, setValue] = useState(typeof valueFromStore === 'undefined' ? initialValue : valueFromStore);

  const setValueAndSave: SetValueAndSaveAction = val => {
    setValue(val);
    saveToStore(key, val);
  };

  return [value as T, setValueAndSave];
};

export default useLocalStorageState;
