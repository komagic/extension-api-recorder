// do not import

import { getOriginPath } from '@root/utils/http/getOriginPath';

import { default as xhook } from './main';
const cache_name = '_api_recorder_';
const cache_requests = '_api_recorder_requests_';

window[cache_requests] = {};

export const sendResponseMessage = async (url, response, type = 'XHR') => {
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

const getRequests = () => {
  return window[cache_requests];
};
export const registerRequest = request => {
  const url = getOriginPath(request.url);
  window[cache_requests][url] = request;
  console.log('registerRequest', getRequests());
};

const getState = () => {
  return window[cache_name];
};

const setState = state => {
  window[cache_name] = state;
};

const enable_save_response = (state, config, url) => {
  let apis_map = state?.apis_map || {};
  if (!state) {
    return true;
  }
  if (!state.enable) {
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

    // this.interceptFetch();
  }

  getResponseByUrl(url, state) {
    const path = getOriginPath(url);
    let item = state.apis_map[path];
    return item?.data[item?.current || 0];
  }

  addListeners() {
    window.addEventListener('message', ({ data }) => {
      if (data.type === 'inject:update-store') {
        setState(data.data);
      } else if (data.type === 'inject:reload-request') {
        const url = data.url;
        const requests_map = getRequests();

        const req = requests_map[url];
        console.log('reload request', req, url, requests_map);

        if (req?.isFetch) {
          fetch(req.url, req);
        } else if (req?.xhr) {
          req.xhr.send();
        }
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

    xhook.before(function (request, callback) {
      //   console.log("xhr request",request);

      const state = getState();

      registerRequest(request);
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

      // const enable_save_response = true||(enable_white_list(request.url) && disable_black_list(request.url));
      if (response.status === 204) {
        return;
      }
      const flag = enable_save_response(state, config, request.url);
      console.log(flag, 'after request:', request);

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