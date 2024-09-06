// do not import

import { cache_requests, cache_state } from '@root/src/shared/constant';
import { getFromStore } from '@root/src/shared/store/local-store';
import { getOriginPath } from '@root/utils/http/getOriginPath';
import { logger } from '@root/utils/log';

import AppStore from '../../ui/Context/AppStore';

import fetchInterceptor from './fetch-interceptor';
import ajaxProxy from './proxy-xhr';

window[cache_requests] = {};

const INTERCEPT_TYPE = {
  XHR: 'XHR',
  FETCH: 'FETCH',
};

export const sendResponseMessage = async (url, responseText, type = INTERCEPT_TYPE.XHR) => {
  if (type === INTERCEPT_TYPE.FETCH) {
    logger('FETCH::', responseText);

    responseText.text().then(function (text) {
      window.postMessage(
        {
          type,
          data: text,
          // headers: response.headers,
          headers: {},
          url: getOriginPath(url),
        },
        '*',
      );
    });
  } else {
    logger('xhr::', responseText);

    window.postMessage(
      {
        type,
        // headers: response.headers,
        headers: {},
        data: responseText,
        url: getOriginPath(url),
      },
      '*',
    );
  }
};

const getCacheRequests = () => {
  return window[cache_requests];
};

const getState = () => {
  return window[cache_state];
};

const setState = state => {
  window[cache_state] = state;
};

const isEnableExtension = () => {
  try {
    const store = getFromStore();
    return !!store.enable || false;
  } catch (error) {
    console.error('isEnableExtension', error);
  }
};

const isMatchRules = url => {
  const store = getFromStore();
  const rules = store.rules;
};

const enable_save_response = (state, config, url) => {
  const apis_map = state?.apis_map || {};
  if (!state) {
    return true;
  }
  if (!isEnableExtension()) {
    return false;
  }

  const path = getOriginPath(url);
  // enable when empty
  if (apis_map && !apis_map[path]) {
    return true;
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
    this.interceptFetch();
  }

  getResponseByUrl(url, state) {
    const path = getOriginPath(url);
    const item = state?.apis_map?.[path];
    return item?.data[item?.current || 0];
  }

  addListeners() {
    window.addEventListener('message', ({ data }) => {
      if (data.type === 'inject:update-store') {
        setState(data.data);
      }
      // 获取请求
      else if (data.type === 'inject:reload-request') {
        const url = data.url;
        const requests_map = getCacheRequests();
        console.log('rereqreqreq', requests_map[url], url);

        const req = requests_map[url]?.request;
        if (url in requests_map) {
          if (req instanceof Request) {
            fetch(req.url, req);
          } else if (req?.send) {
            this.resendXHR(req);
          }
        }
      }
    });
  }

  getConfig = (url, state) => {
    const path = getOriginPath(url);
    if (!state) {
      return;
    }

    const item = state.apis_map[path];

    return item;
  };

  registerRequest = (response_url, request, type = 'XHR') => {
    const url = getOriginPath(response_url);
    if (!url) return;

    if (!window[cache_requests][url]) {
      window[cache_requests][url] = {
        request: {},
        response: {},
        type,
      };
    }

    window[cache_requests][url]['request'] = request;
  };

  registerResponse = (response, api, type = INTERCEPT_TYPE.XHR) => {
    const url = getOriginPath(api);
    // if (!window[cache_requests][url]) {
    //   window[cache_requests][url] = {
    //     request: {},
    //     response: {},
    //     type,
    //   };
    // }
    window[cache_requests][url].response = response;
  };

  captureResponse = (responseText: string | Response, res, type = INTERCEPT_TYPE.XHR) => {
    const url = type === INTERCEPT_TYPE.XHR ? res.responseURL : res.url;
    const state = getState();
    const config = this.getConfig(url, state);

    const better_url = url;

    // const enable_save_response = true||(enable_white_list(request.url) && disable_black_list(request.url));
    if (res.status === 204) {
      return;
    }
    if (url?.includes('chrome-extension')) {
      return;
    }

    const flag = enable_save_response(state, config, better_url);
    // this enable record
    if (flag) {
      if (res?.status === 200) {
        this.registerResponse(responseText, better_url, type);
        sendResponseMessage(better_url, responseText, type);
      }
    }
  };

  resendXHR = originalXHR => {
    // 创建新的 XMLHttpRequest 对象
    const newXHR = new window.XMLHttpRequest();
    newXHR.withCredentials = true;
    // 获取原始请求的信息
    const method = originalXHR.method || originalXHR.requestMethod;
    const url = originalXHR.responseURL; // 可能需要控制访问跨域的问题
    const async = originalXHR.async; // 一般使用异步请求，您也可以根据需求设置
    //perform open
    newXHR.open(method, url, async, originalXHR.user, originalXHR.pass);
    //write xhr settings
    newXHR.onloadend = originalXHR.onloadend
    //insert headers
    for (const header in originalXHR.headers) {
      const value = originalXHR.headers[header];
      if (header) {
        newXHR.setRequestHeader(header, value);
      }
    }
    //real send!
    newXHR.send(originalXHR.body);
  };

  convert = function (headers, dest) {
    const CRLF = '\r\n';

    const objectToString = function (headersObj) {
      const entries = Object.entries(headersObj);

      const headers = entries.map(([name, value]) => {
        return `${name.toLowerCase()}: ${value}`;
      });

      return headers.join(CRLF);
    };

    const stringToObject = function (headersString, dest) {
      const headers = headersString.split(CRLF);
      if (dest == null) {
        dest = {};
      }

      for (let header of headers) {
        if (/([^:]+):\s*(.+)/.test(header)) {
          const name = RegExp.$1 != null ? RegExp.$1.toLowerCase() : undefined;
          const value = RegExp.$2;
          if (dest[name] == null) {
            dest[name] = value;
          }
        }
      }

      return dest;
    };

    switch (typeof headers) {
      case 'object': {
        return objectToString(headers);
      }
      case 'string': {
        return stringToObject(headers, dest);
      }
    }

    return [];
  };

  readHead = xhr => {
    // Accessing attributes on an aborted xhr object will
    // throw an 'c00c023f error' in IE9 and lower, don't touch it.
    const headers = {
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': true,
    };

    const object = this.convert(xhr.getAllResponseHeaders(), headers);
    for (const key in object) {
      const val = object[key];
      if (!headers[key]) {
        const name = key.toLowerCase();
        headers[name] = val;
      }
    }
    return headers;
  };

  interceptXHR = async () => {
    const self = this;

    ajaxProxy.proxyAjax({
      open: function (args, xhr) {
        this.method = args[0];
        this.async = args[2];
      },

      // responseText: {
      //   setter: function (value, xhr) {
      //     return value;
      //   },
      // },

      send: function (args, xhr) {
        this.body = args[0];
      },
      onloadend: function (xhr) {
        const responseText = xhr.responseText;
        const url = xhr.responseURL
        self.registerRequest(url, xhr);
        const state = getState();
        const config = self.getConfig(url, state);
        
        if (isEnableExtension() && !config?.enable_mock) {
          self.captureResponse(responseText, xhr, INTERCEPT_TYPE.XHR);
        }

        if (isEnableExtension() && config?.enable_mock) {
          const responseText = self.getResponseByUrl(xhr.responseURL, state);
          Object.defineProperty(xhr, 'response', { writable: true });
          Object.defineProperty(xhr, 'responseText', { writable: true });
          xhr.responseText = responseText;
          xhr.response = responseText;
        }
      },
    });
  };

  interceptFetch() {
    const self = this;
    return fetchInterceptor.register({
      request: async function (url, config) {
        // Modify the url or config here
        if (isEnableExtension()) {
          try {
            const state = await AppStore.load();
            const _config = self.getConfig(url, state);
  
            if (_config?.enable_mock) {
              const responseText = self.getResponseByUrl(url, state);
  
              return Promise.reject(
                new Response(new Blob([responseText]), {
                  status: 200,
                  statusText: 'fromCache',
                  headers: { 'Content-Type': 'application/json' },
                }),
              );
            }
          } catch (error) {
            console.error('interceptFetch:error', error);
          }
         
        }
        return [url, config];
      },

      requestError: function (error) {
        return Promise.reject(error);
      },

      responseError: function (error) {
        if (error?.statusText === 'fromCache') {
          return Promise.resolve(error);
        }
        return error;
      },

      response: function (response) {
        // Modify the reponse object
        const state = getState();
        const config = self.getConfig(response.url, state);
        const cloneReponse = response.clone();
        self.registerRequest(cloneReponse.url, response.request, INTERCEPT_TYPE.FETCH);
        // mock
        if (isEnableExtension() && !config?.enable_mock) {
          self.captureResponse(cloneReponse, cloneReponse, INTERCEPT_TYPE.FETCH);
        }

        return response;
      },
    });
  }
}

// 使用拦截器

export default RequestInterceptor;
