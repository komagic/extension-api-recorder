import React, { createContext, useContext, useReducer } from 'react';
import packagejson from '/package.json';
import useModal from './useModal';
import { Modal } from '@nextui-org/react';
import StoreStorage from '@root/src/pages/content/extension/chromeStorage/StoreStorage';
import { useReactive } from 'ahooks';

interface IDataItem {
  // 接口路径
  api: string;
  // 状态
  status: 'recording' | 'default' | 'mocking';

  // 缓存返回数据，最大3个
  list: Response[];
}

// 定义初始状态
const initialState = new StoreStorage();
// 定义 reducer 函数

// 创建 Context

const StoreContext = createContext<IValue | null>(null);
interface IValue {
  storeData: StoreStorage;
  dispatch?: any;
  ModalComponent?: any;
  onOpen?: (p) => void;
}
// 创建 StoreProvider 组件
export const StoreProvider = ({ children }) => {
  const storeData = useReactive(initialState);

  const { ModalComponent, onOpen } = useModal();
  const value: IValue = { storeData, ModalComponent, onOpen };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
};
