import { createContext, useContext, useEffect, useReducer } from 'react';
// import packagejson from 'package.json';
import { MessageNames } from '@root/src/core/constants';
import dbStore, { API_MAP_TYPE } from './AppStore';
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
  apis_map: API_MAP_TYPE;
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
export enum ACTIONS {
  SET_DATA,
  UPDATE_STATE,
  TOGGLE_MOCK,
  TOGGLE_RECORD,
  TOGGLE_APP,
}

const createApiMap = (p = {}) => {
  return {
    enable_mock: false,
    enable_record: true,
    current: 0,
    data: [],
    ...p,
  };
};

const updateWindowStore = state => {
  // localStorage.setItem('__api_recorder__',JSON.stringify(state));
  window.postMessage(
    {
      type: 'update-store',
      data: state,
    },
    window.location.href,
  );
  console.log('updateWindowStore', window.location.href);
};

const syncSave = async (storeName, data) => {};

const reducer = (s, action) => {
  let state = s;
  switch (action.type) {
    case ACTIONS.TOGGLE_APP:
      console.log('ACTIONS.TOGGLE_APP', action);
      state.enable = action.payload;
      break;

    case ACTIONS.TOGGLE_MOCK:
      state.apis_map[action.payload.api].enable_mock = action.payload.bol;
      state.apis_map[action.payload.api].enable_record = !action.payload.bol;
      break;

    case ACTIONS.TOGGLE_RECORD:
      state.apis_map[action.payload.api].enable_record = action.payload.bol;
      if (action.payload.bol === true) {
        state.apis_map[action.payload.api].enable_mock = false;
      }

      break;

    case MessageNames.XHR:
      const url = action.url;
      if (!url) {
        return state;
      }
      if (!state.apis_map[url]) {
        state.apis_map[url] = createApiMap({
          method: MessageNames.XHR,
        });
      } else {
        state.apis_map[url].method = MessageNames.XHR;
        state.apis_map[url].data.push(action.payload);
        // 如果大于3
        while (state.apis_map[url].data.length > 3) {
          state.apis_map[url].data.shift();
        }
      }
      break;

    case ACTIONS.SET_DATA:
      const { data, index, api } = action.payload;
      try {
        if (state?.apis_map[api]?.data?.[index]) {
          state.apis_map[api].data[index] = data;
          console.log('SET_DATA', state, state.apis_map[api], state?.apis_map[api]?.data?.[index]);
        }
      } catch (error) {}

      dbStore.save(state);
      break;

    case ACTIONS.UPDATE_STATE:
      state = { ...state, ...action.payload };
      updateWindowStore(state);

      break;
    default:
      return state;
  }

  state = { ...state };
  updateWindowStore(state);
  dbStore.save(state);
  return state;
};
// 创建 StoreProvider 组件
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initData = async () => {
    const data = await dbStore.load();
    console.log('initData', data);
    updateWindowStore(data);
    dispatch({
      type: ACTIONS.UPDATE_STATE,
      payload: data,
    });
  };

  useEffect(() => {
    initData();
  }, []);

  const handler = (e: MessageEvent<any>) => {
    const { type, data, url } = e?.data;
    console.log('useNetTabledata', data);

    dispatch({
      type: MessageNames.XHR,
      payload: data,
      url,
    });
  };

  useEffect(() => {
    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
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
