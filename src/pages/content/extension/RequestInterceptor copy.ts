// do not import
import xhook from './xhook.min.js';

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
    this.interceptXHR();
    this.interceptFetch();
  }

  getResponseByUrl(url, state) {
    let item = state.apis_map[url];
    return item?.data[item?.current || 0];
  }

  private interceptXHR() {
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    const self = this;
    XMLHttpRequest.prototype.open = function (method: string, url: string) {
      // 在这里你可以修改请求
      console.log(`XHR Request Initiated: ${method} ${url}`);
      let mock_response;

      // 可以修改请求的URL，或者保存请求数据
      this.onreadystatechange = function () {
        if (this.readyState === 1) {
          const state_str = localStorage.getItem('__api_recorder__');
          try {
            const state = JSON.parse(state_str || '{}');
            mock_response = self.getResponseByUrl(url, state);
          } catch (error) {}
          setTimeout(() => {
            console.log('this.response', this.response, mock_response);
          }, 100);
          if (mock_response) {
            if (mock_response) {
              // const data = JSON.stringify(mock_response);
              const data =
                typeof mock_response == 'string'
                  ? mock_response.replace('20240806141738648', '冯娜冯娜冯娜冯娜冯娜冯娜冯娜')
                  : JSON.stringify(mock_response);
              // 模拟响应
              // this.status = 200;
              // this.statusText = 'OK';
              this.response = this.responseText = JSON.stringify(data);

              // 手动触发 readystatechange 事件，表示请求已完成
              // this.readyState = 4;
              this.onreadystatechange && this.onreadystatechange();

              // 手动触发 load 事件
              return this.onload && this.onload();
            }
          }
        }

        if (this.readyState === XMLHttpRequest.DONE) {
          // console.log(`XHR Response: ${this.responseText}`);
          try {
            const path = url;
            console.log('XHR Response:', url);
            if (!mock_response && this.responseText) {
              sendResponseMessage(path, this.responseText);
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
