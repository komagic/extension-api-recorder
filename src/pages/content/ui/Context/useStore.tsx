import { createContext, useContext, useEffect, useReducer } from 'react';
import packagejson from '@root/package.json';
import { MessageNames } from '@root/src/core/constants';
import dbStore, { API_MAP_TYPE } from './AppStore';
import { matchesAnyRule } from '@root/utils/http/matchesAnyRule';
import { DEFAULT_RULES } from '@root/src/constant';
import { logger } from '@root/utils/log';

export interface IState {
  version: string;
  store_name: string;
  enable: boolean;

  // 高度：
  height: number;
  apis_map: API_MAP_TYPE;

  web_requests: {
    [url in string]: any;
  };

  // 匹配规则
  rules: string[];
}

// 定义 reducer 函数

// 创建 Context

const StoreContext = createContext<IValue | null>(null);
interface IValue {
  state: IState;
  dispatch?: React.Dispatch<any>;
  ModalComponent?: React.ReactNode;
  onOpen?: (p: any) => void;
}
// 定义初始状态
const initialState: IState = {
  version: packagejson['version'],
  store_name: 'api_recorder',
  enable: true,
  height: 0,
  rules: DEFAULT_RULES,
  web_requests: {},
  apis_map: {},
};
export enum ACTIONS {
  SET_DATA,
  UPDATE_STATE,
  TOGGLE_MOCK,
  TOGGLE_RECORD,
  TOGGLE_APP,
  UPDATE_RULES,
  UPDATE_CURRENT,
  UPDATE_REQUEST,

  RESOLVE_REQUEST,
}

const createApiMap = (p = {}) => {
  return {
    enable_mock: false,
    enable_record: true,
    current: 0,
    data: [],
    responseHeaders: {},
    ...p,
  };
};

const getUrlOriginPath = (url: string) => {
  try {
    const item = new URL(url);
    return item.origin + item.pathname;
  } catch (error) {
    logger('getUrlOriginPath:error', error);
  }
};

const updateWindowStore = state => {
  // localStorage.setItem('__api_recorder__',JSON.stringify(state));
  window.postMessage(
    {
      type: 'inject:update-store',
      data: state,
    },
    window.location.href,
  );
  logger('updateWindowStore', window.location.href);
};

const reloadRequest = url => {
  console.log('reloadRequest',url);
  window.postMessage(
    {
      type: 'inject:reload-request',
      url: url,
    },
    window.location.href,
  );
};


const reducer = (s, action) => {
  let state = s,
    url;
  switch (action.type) {
    case ACTIONS.TOGGLE_APP:
      logger('ACTIONS.TOGGLE_APP', action);
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
      url = action.url;
      if (!url) {
        return state;
      }
      if (!state.apis_map[url]) {
        state.apis_map[url] = createApiMap({
          method: MessageNames.XHR,
        });
      } else {
        state.apis_map[url].responseHeaders = action.headers;
        state.apis_map[url].method = MessageNames.XHR;
        state.apis_map[url].data.push(action.payload);
        // 如果大于3
        while (state.apis_map[url].data.length > 3) {
          state.apis_map[url].data.pop();
        }
      }

      // 根据rules规则,剔除不符合规则的内容
      Object.keys(state.apis_map).forEach(url => {
        const flag = matchesAnyRule(url, state.rules);
        if (!flag) {
          delete state.apis_map[url];
        }
      });

      break;

    case MessageNames.FETCH: {
      url = getUrlOriginPath(action.url);
      if (!url) {
        return state;
      }
      if (!state.apis_map[url]) {
        state.apis_map[url] = createApiMap({
          method: MessageNames.FETCH,
        });
      } else {
        state.apis_map[url].responseHeaders = action.headers;
        state.apis_map[url].method = MessageNames.FETCH;
        state.apis_map[url].data.push(action.payload);
        // 如果大于3
        while (state.apis_map[url].data.length > 3) {
          state.apis_map[url].data.shift();
        }
      }

      // 根据rules规则,剔除不符合规则的内容
      Object.keys(state.apis_map).forEach(url => {
        const flag = matchesAnyRule(url, state.rules);
        if (!flag) {
          delete state.apis_map[url];
        }
      });

      break;
    }
    // 注册request
    case MessageNames.REQUEST:
      logger('MessageNames.REQUEST', action);
      state.web_requests[action.url] = action.payload;
      break;

    case ACTIONS.SET_DATA:
      try {
        const { data, index, api } = action.payload;
        if (state?.apis_map[api]?.data?.[index]) {
          state.apis_map[api].data[index] = data;
          logger('SET_DATA', state, state.apis_map[api], state?.apis_map[api]?.data?.[index]);
        }
      } catch (error) {
        console.error(error);
      }

      break;
    case ACTIONS.UPDATE_CURRENT:
      try {
        const { api, current } = action.payload;
        if (state?.apis_map[api]) {
          state.apis_map[api].current = current;
        }
      } catch (error) {
        console.log(error);
      }

      break;

    case ACTIONS.UPDATE_RULES:
      state.rules = action.payload;
      break;
    case ACTIONS.RESOLVE_REQUEST: {
      reloadRequest(action.payload.api);
      return state;
    }
    case ACTIONS.UPDATE_STATE:
      state = { ...state, ...action.payload };
      break;
    default:
      return state;
  }

  state = { ...state };
  updateWindowStore(state);
  logger(' dbStore.save', state);
  dbStore.save(state);
  return state;
};
// 创建 StoreProvider 组件
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initData = async () => {
    const data = await dbStore.load();
    logger('initData', data);
    updateWindowStore(data);
    dispatch({
      type: ACTIONS.UPDATE_STATE,
      payload: data,
    });
  };

  useEffect(() => {
    initData();
  }, []);

  const xhrhandler = (e: MessageEvent<any>) => {
    const { type, data, url, headers = {} } = e.data;
    dispatch({
      type: type,
      payload: data,
      headers,
      url,
    });
  };

  useEffect(() => {
    window.addEventListener('message', xhrhandler);
    return () => {
      window.removeEventListener('message', xhrhandler);
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
