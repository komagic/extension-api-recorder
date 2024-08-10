import { data } from 'autoprefixer';

const sendMessage = message => {
  window.postMessage(
    {
      type: 'apirecorder_xhr_response',
      data: message,
    },
    '*',
  );
};

class RequestInterceptor {
  constructor() {
    this.interceptXHR();
    this.interceptFetch();
  }

  private interceptXHR() {
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method: string, url: string) {
      // 在这里你可以修改请求
      console.log(`XHR Request Initiated: ${method} ${url}`);
      // 可以修改请求的URL，或者保存请求数据
      this.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          // console.log(`XHR Response: ${this.responseText}`);

          try {
            const path = new URL(window.location.origin + url)?.pathname;
            const res = JSON.parse(this.responseText);
            console.log('XHR Response:', this.responseText);
            if (this.responseText) {
              sendMessage(this.responseText);
            }
          } catch (error) {
            console.error('XHR  error:', error);
          }
        }
      };
      originalXhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body?: Document | Body | null) {
      // 在这里可以修改请求体
      console.log('XHR Request Body:', body);
      originalXhrSend.apply(this, arguments);
    };
  }

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
          'X-Custom-Header': 'MyValue',
        },
      };

      const response = await originalFetch(input, modifiedInit);
      let responseJson = {
        data: 222,
      };
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
