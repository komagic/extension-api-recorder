import { createContext, useContext, useEffect, useReducer } from 'react';
// import packagejson from 'package.json';
import { MessageNames } from '@root/src/core/constants';
import dbStore from './AppStore';
import { data } from 'autoprefixer';

interface IDataItem {
  // 接口路径
  api: string;
  // 状态
  status: 'recording' | 'default' | 'mocking';

  // 缓存返回数据，最大3个
  list: Response[];
}

export interface IState {
  version: string;
  store_name: string;
  enable: boolean;
  apis_map: {
    [key: string]: {
      enable_mock: boolean;
      enable_record: boolean;
      current: number;
      data: string[];
    };
  };
}

// 定义 reducer 函数

// 创建 Context

const StoreContext = createContext<IValue | null>(null);
interface IValue {
  state: IState;
  dispatch?: any;
  ModalComponent?: any;
  onOpen?: (p) => void;
}
// 定义初始状态
const initialState: IState = {
  version: '1.0.0',
  store_name: 'api_recorder',
  enable: true,
  apis_map: {},
};
export const Actions = {
  SET_DATA: 'SET_DATA',
  UPDATE_STATE: 'UPDATE_STATE',
};

const createApiMap = () => {
  return {
    enable_mock: true,
    enable_record: false,
    current: 0,
    data: [],
  };
};

const updateWindowStore = state => {
  // localStorage.setItem('__api_recorder__',JSON.stringify(state));
  // window.postMessage({
  //   type: 'update-store',
  //   data: state,
  // },window.location.href)
  console.log('updateWindowStore', window.location.href);
};

const syncSave = async (storeName, data) => {};

const reducer = (state, action) => {
  switch (action.type) {
    case MessageNames.XHR:
      const url = action.url;
      if (!url) {
        return state;
      }
      if (!state.apis_map[url]) {
        state.apis_map[url] = createApiMap();
      } else {
        state.apis_map[url].data.push(action.payload);
        // 如果大于3
        while (state.apis_map[url].data.length > 3) {
          state.apis_map[url].data.shift();
        }
      }
      dbStore.save(state);

      updateWindowStore(state);
      return { ...state };

    case Actions.SET_DATA:
      try {
        const url = action.api;
        const index = action.index;
        if (state?.apis_map?.[url]?.data?.[index]) {
          state.apis_map[url].data[index] = action.data;
          updateWindowStore(state);
          return { ...state };
        } else {
          return state;
        }
      } catch (error) {}

      dbStore.save(state);
      updateWindowStore(state);
      return { ...state };

    case Actions.UPDATE_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
// 创建 StoreProvider 组件
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initData = async () => {
    const data = await dbStore.load();
    dispatch({
      type: Actions.UPDATE_STATE,
      payload: data,
    });
  };

  useEffect(() => {
    initData();
  }, []);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
};
