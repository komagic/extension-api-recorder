
/**
 * 
Copyright (c) 2015 werk85

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

let interceptors = [];

function interceptor(fetch, ...args) {
  const reversedInterceptors = interceptors.reduce((array, interceptor) => [interceptor].concat(array), []);
  console.log('interceptorinterceptor', fetch, ...args);

  let promise = Promise.resolve(args);

  // Register request interceptors
  reversedInterceptors.forEach(({ request, requestError }) => {
    if (request || requestError) {
      promise = promise.then(args => request(...args), requestError);
    }
  });

  // Register fetch call
  promise = promise.then((args: [RequestInfo | URL, RequestInit]) => {
    const request = new Request(...args);
    return fetch(request)
      .then(response => {
        response.request = request;
        return response;
      })
      .catch(error => {
        error.request = request;
        return Promise.reject(error);
      });
  });

  // Register response interceptors
  reversedInterceptors.forEach(({ response, responseError }) => {
    if (response || responseError) {
      promise = promise.then(response, responseError);
    }
  });

  return promise;
}

function main(env) {
  // Make sure fetch is available in the given environment
  if (!env.fetch) {
    try {
      require('whatwg-fetch');
    } catch (err) {
      throw Error('No fetch available. Unable to register fetch-intercept');
    }
  }
  env.fetch = (function (fetch) {
    return function (...args) {
      return interceptor(fetch, ...args);
    };
  })(env.fetch);

  return {
    register: function (interceptor: FetchInterceptor) {
      if (Object.keys(interceptor).length < 1) {
        return;
      }
      interceptors.push(interceptor);

      return () => {
        const index = interceptors.indexOf(interceptor);
        if (index >= 0) {
          interceptors.splice(index, 1);
        }
      };
    },
    clear: function () {
      interceptors = [];
    },
  };
}

// const fetchInterceptor = main(window);
export let fetchInterceptor;
export const init = () => {
  fetchInterceptor = main(window);
};


export interface FetchInterceptorResponse extends Response {
  request: Request;
}
 
export interface FetchInterceptor {
      request?(url: string, config: any): Promise<any[]> | any[];
      requestError?(error: any): Promise<any>;
      response?(response: FetchInterceptorResponse): FetchInterceptorResponse;
      responseError?(error: any): Promise<any>;
}
  
