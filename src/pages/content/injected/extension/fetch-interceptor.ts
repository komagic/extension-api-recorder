
let interceptors = [];

function interceptor(fetch, ...args) {
  const reversedInterceptors = interceptors.reduce((array, interceptor) => [interceptor].concat(array), []);
  let promise = Promise.resolve(args);

  // Register request interceptors
  reversedInterceptors.forEach(({ request, requestError }) => {
    if (request || requestError) {
      promise = promise.then(args => request(...args), requestError);
    }
  });

  // Register fetch call
  promise = promise.then(args => {
    const request = new Request(...args);
    return fetch(request).then(response => {
      response.request = request;
      return response;
    }).catch(error => {
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
    }
  };
};


const fetchInterceptor = main(window);

export default fetchInterceptor;


 
    export interface FetchInterceptor {
      request?(url: string, config: any): Promise<any[]> | any[];
      requestError?(error: any): Promise<any>;
      response?(response: FetchInterceptorResponse): FetchInterceptorResponse;
      responseError?(error: any): Promise<any>;
    }
  
    export function register(interceptor: FetchInterceptor): () => void;
    export function clear(): void;
