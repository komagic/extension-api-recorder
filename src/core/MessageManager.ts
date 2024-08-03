type MessageHandler = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => void;

class MessageManager {
  private channel: chrome.runtime.Port | null = null;
  private handlers: MessageHandler[] = [];

  // 初始化通信通道
  constructor(name: string) {
    this.channel = chrome.runtime.connect({ name });
    this.channel.onMessage.addListener(this.handleMessage.bind(this));
  }

  // 处理通信通道消息
  private handleMessage(message: any, sender: chrome.runtime.MessageSender): void {
    this.handlers.forEach(handler => handler(message, sender, () => {}));
  }

  // 发送消息
  sendMessage(message: any): void {
    if (this.channel) {
      this.channel.postMessage(message);
    } else {
      console.error('Channel is not initialized.');
    }
  }

  // 添加消息监听器
  addListener(handler: MessageHandler): void {
    this.handlers.push(handler);
  }

  // 初始化全局消息监听器
  initGlobalListener(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handlers.forEach(handler => handler(message, sender, sendResponse));
      return true; // 表示异步响应
    });
  }

  // 向内容脚本发送消息
  sendMessageToContentScript(tabId: number, message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, response => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }
}

export default MessageManager;
