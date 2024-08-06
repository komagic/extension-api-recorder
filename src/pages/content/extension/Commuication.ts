export interface Message<T = any> {
  type: string;
  payload?: T;
}

const BASE_CHANNEL = 'recorder_channel:';

const getChannel = (channel: string) => {
  return BASE_CHANNEL + channel;
};

const CHANNEL = {
  B2C: getChannel('B2C'),
  C2B: getChannel('C2B'),
  C2I: getChannel('C2I'),
  B2I: getChannel('B2I'),
};

// Communication.ts
export class Communication {
  constructor(chrome) {
    // 在这里进行一些初始化，比如监听消息
    this.init(chrome);
  }

  private init(chrome) {
    // 监听来自内容脚本或注入脚本的消息
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // 表示我们希望异步响应
    });
  }

  static setupBackgroundListener(chrome) {
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
      console.log('Received message from content script:', message);
      // 在这里处理消息
      // 是否是发给自己
      if (message.type === CHANNEL.C2B) {
        console.log('Received message from content script:', message.data);
        // 可以发送消息到 inject.js
        // chrome.tabs.sendMessage(sender.tab.id, { type: "FROM_BACKGROUND", data: "Hello from background!" });
        // sendResponse({ type: 'RESPONSE', payload: 'Response from background script' });
      }
    });
  }

  static setupContentListener(chrome) {
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
      console.log('Received message from content script:', message);
      // 在这里处理消息
      // 是否是发给自己
      if (message.type === CHANNEL.C2B) {
        console.log('Received message from content script:', message.payload);
        // 可以发送消息到 inject.js
        // chrome.tabs.sendMessage(sender.tab.id, { type: "FROM_BACKGROUND", data: "Hello from background!" });
        // sendResponse({ type: 'RESPONSE', payload: 'Response from background script' });
      }
    });
  }

  static setupInjectListener(window: Window) {
    window.addEventListener('message', event => {
      if (event.source !== window) return; // 确保消息来自 content.js
      if (event.data.type && event.data.type === CHANNEL.C2I) {
        console.log('Received message from content script:', event.data.data);
        // 你可以在这里进行处理或回复
      }
    });
  }

  static sendMessageToBackground(chrome) {
    chrome.runtime.sendMessage({
      type: CHANNEL.C2B,
      data: 'Hello from content!',
    });
  }

  // 处理消息
  private handleMessage(
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) {
    switch (message.type) {
      case CHANNEL.B2C:
        sendResponse({ type: 'PONG', payload: 'Hello from background!' });
        break;
      // 处理其他消息类型
      default:
        console.warn('Unhandled message type:', message.type);
    }
  }

  // 从内容脚本或注入脚本发送消息
  public static sendMessage<T>(message: Message<T>): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, response => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
}

// 示例：在内容脚本中使用
// content.ts
// const comm = new Communication(chrome);

// 发送消息到背景脚本
Communication.sendMessage({ type: 'PING' })
  .then(response => {
    console.log('Received response:', response);
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });
