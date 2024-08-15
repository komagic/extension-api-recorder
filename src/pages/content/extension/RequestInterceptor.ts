// do not import

import { default as xhook } from './main';

const whiteList = ['.alipay.net', '.json', '/campus'];
const blackList = ['.min.js'];
const enable_white_list = url => {
  return whiteList.some(item => url.indexOf(item) > -1);
};

const disable_black_list = url => {
  return blackList.some(str => !url.includes(str));
};

const getOriginPath = (current_url: string): string => {
  // 定义协议和域名
  let url = current_url;
  // 移除首尾的空格并处理不同的 URL格式
  url = url.trim();
  if (url.startsWith('//')) {
    url = `${window.location.protocol}${url}`;
  } else if (url.startsWith('http')) {
    url = url;
  }

  try {
    // 提取路径
    const urlObj = new URL(url);
    // 使用规范的域名和协议构造新的 URL
    return urlObj.origin + urlObj.pathname;
  } catch (error) {}
  return url;
};

const sendResponseMessage = async (url, response, type = 'XHR') => {
  if (type === 'FETCH') {
    response.text().then(function (text) {
      window.postMessage(
        {
          type,
          data: text,
          url: getOriginPath(url),
        },
        '*',
      );
    });
  } else {
    console.log('sendResponseMessage xhr', response.text);

    window.postMessage(
      {
        type,
        data: response.text,
        url: getOriginPath(url),
      },
      '*',
    );
  }
};

const cache_name = '_api_recorder_';

const getState = () => {
  return window[cache_name];
};

const setState = state => {
  window[cache_name] = state;
};

const enable_save_response = (state, config, url) => {
  let apis_map = state?.apis_map || {};
  if (!state?.enable) {
    return false;
  }

  // enable when empty
  if (Object.keys(apis_map)?.length === 0) {
    return true;
  }

  if (blackList.some(b => url.includes(b))) {
    return false;
  }

  if (config?.enable_record && config.enable_mock === false) {
    return true;
  }

  return false;
};

class RequestInterceptor {
  constructor() {
    this.addListeners();
    this.interceptXHR();

    // this.interceptFetch();
  }

  getResponseByUrl(url, state) {
    const path = getOriginPath(url);
    let item = state.apis_map[path];
    return item?.data[item?.current || 0];
  }

  addListeners() {
    window.addEventListener('message', ({ data }) => {
      if (data.type === 'update-store') {
        setState(data.data);
      }
    });
  }

  getConfig = (url, state) => {
    const path = getOriginPath(url);
    if (!state) {
      return;
    }
    let item = state.apis_map[path];
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
        callback(new Response(new Blob([responseText])), {
          status: 200,
          statusText: 'OK',
        });
      }

      callback();
    });

    xhook.after(function (request, response, cb) {
      const state = getState();
      const config = self.getConfig(request.url, state);

      const matchRules = /.json/;

      // const enable_save_response = true||(enable_white_list(request.url) && disable_black_list(request.url));
      if (response.status === 204) {
        return;
      }
      const flag = enable_save_response(state, config, request.url);
      console.log(flag, 'after: response', response, 'request:', request);

      // this enable record
      if (flag) {
        if (response && response.status === 200) {
          try {
            if (request?.isFetch) {
              let cloneResponse = response.clone();
              sendResponseMessage(request.url, cloneResponse, 'FETCH');
            } else {
              sendResponseMessage(request.url, response, 'XHR');
            }
          } catch (error) {
            console.error(' xhook.after: error', error);
          }
        }
      }

      // if (state?.enable && config?.enable_mock) {
      //   const responseText = self.getResponseByUrl(request.url, state);
      //   return cb(new Response(new Blob([responseText])), {
      //     status: 200,
      //     statusText: 'OK',
      //   });
      // }

      // end
      cb(response);
    });
  };
}

// 使用拦截器

export default RequestInterceptor;
