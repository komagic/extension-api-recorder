// do not import

import { default as xhook } from './main';
const sendResponseMessage = (url, data, type = 'XHR') => {
  window.postMessage(
    {
      type,
      data: data,
      url,
    },
    '*',
  );
};

const cache_name = '_api_recorder_';

const getState = () => {
  return window[cache_name];
};

const setState = state => {
  window[cache_name] = state;
};

class RequestInterceptor {
  constructor() {
    this.addListeners();
    this.interceptXHR();

    this.interceptFetch();
  }

  getResponseByUrl(url, state) {
    let item = state.apis_map[url];
    return item?.data[item?.current || 0];
  }

  addListeners() {
    window.addEventListener('message', ({ data }) => {
      if (data.type === 'update-store') {
        setState(data.data);
        console.log('event.data:', data.data);
      }
    });
  }

  getConfig = (url, state) => {
    if (!state) {
      return;
    }
    let item = state.apis_map[url];
    return item;
  };

  interceptXHR = async () => {
    /**
     * 如果有缓存且enable_mock为true，则直接返回缓存数据
     */
    const self = this;

    const state = getState();

    xhook.before(function (request, callback) {
      //   console.log("xhr request",request);
      const state = getState();

      const config = self.getConfig(request.url, state);

      //如果存在mock
      if (state?.enable && config?.enable_mock) {
        const responseText = self.getResponseByUrl(request.url, state);
        console.log('responseText', state);

        callback({
          status: 200,
          text: responseText,
        });
      } else {
        callback();
      }
    });

    xhook.after(function (request, response) {
      // const state = await self.getState();
      const state = getState();
      const config = self.getConfig(request.url, state);

      if (state?.enable && (!config?.enable_mock || !state?.apis_map?.[request.url])) {
        if (response && response.status === 200) {
          try {
            sendResponseMessage(request.url, response.data, 'XHR');
          } catch (error) {
            console.error(' xhook.after: error', error);
          }
        }
      }
    });
  };

  private interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo, init?: RequestInit) => {
      // 在这里你可以修改请求
      console.log(`Fetch Request Initiated: ${JSON.stringify(input)}`, init);

      // 可以修改请求参数
      const modifiedInit: RequestInit = {
        ...init,
        // 例如，添加一个自定义头
        headers: {
          ...(init?.headers ? init.headers : {}),
          // 'X-Custom-Header': 'MyValue',
        },
      };

      const response = await originalFetch(input, modifiedInit);
      let responseJson = null;
      // 在这里修改 body，返回一个mock body

      if (!responseJson) {
        return response;
      } else {
        let cloneResponse = response.clone();
        cloneResponse.json = () => Promise.resolve(responseJson);
        console.dir(cloneResponse);

        return cloneResponse;
      }

      return response;
    };
  }
}

// 使用拦截器

export default RequestInterceptor;
