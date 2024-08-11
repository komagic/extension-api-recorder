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

class RequestInterceptor {
  constructor() {
    //  this.interceptXHR();
    // this.addListeners();
    this.interceptFetch();
  }

  // async getState() {
  //   try {
  //     // const state = await AppStore.load();
  //     console.log('getState', state);

  //     return state;
  //   } catch (error) {
  //     console.error('getState error', error);
  //   }
  // }

  getResponseByUrl(url, state) {
    let item = state.apis_map[url];
    return item?.data[item?.current || 0];
  }

  addListeners() {
    window.addEventListener('message', event => {
      console.log('event.data', event.data);
      if (event.type === 'update-store') {
        window['__api_recorder_'] = event.data;
        console.log('event.data', event.data);
      }
    });
  }

  getConfig = (url, state) => {
    let item = state.apis_map[url];
    return item;
  };

  interceptXHR = async () => {
    /**
     * 如果有缓存且enable_mock为true，则直接返回缓存数据
     */
    const self = this;
    // if (state.enable) {
    //   xhook.enable();

    // }else{
    //   xhook.disable();
    // }

    xhook.before(function (request, callback) {
      //   console.log("xhr request",request);
      // const config = self.getConfig(request.url, state);
      //如果存在mock
      // if (config?.enable_mock) {
      // const responseText = self.getResponseByUrl(request.url, state);
      // console.log('_api_recorder_', window._api_recorder_);
      //callback with a fake response
      // callback({
      //   status: 200,
      //   text: responseText.replace('超级管理员', '222'),
      // });
      // }
    });

    xhook.after(function (request, response) {
      // const state = await self.getState();
      return response;
      // const config = self.getConfig(request.url, state);
      // if (config?.enable_record && !config.enable_mock) {
      //   if (response && response.status === 200) {
      //     console.log('aaaaa', config);

      //     try {
      //       return sendResponseMessage(request.url, response.body, 'XHR');
      //     } catch (error) {}
      //   }
      // }
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
