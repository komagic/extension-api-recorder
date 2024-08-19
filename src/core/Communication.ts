// export const MessageSources = {
//   ContentScript: 'content-script',
//   DevtoolsPage: 'devtools-page',
// } as const;

import { PortNames, PortNameType } from './constants';
class Communication {
  ports: any;
  constructor(name) {
    this.name = name;

    this.onMessageCallback = null;
    this.ports = {};
  }

  connect(params) {
    return chrome.runtime.connect(params);
  }

  // 向另一端发送消息
  sendMessage(msg) {
    this.port.postMessage(msg);
  }

  // 设置消息接收回调函数
  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  /**
   * 设置后台消息传递中心
   */
  setupBgMessageHub() {
    // 存储连接的端口
    const ports = this.ports;
    console.log('ports:', ports);

    chrome.runtime.onConnect.addListener(port => {
      const portKey = Object.keys(PortNames).find(key => PortNames[key as PortNameType] === port.name);
      console.log('background port', port);

      if (portKey) {
        ports[portKey as PortNameType] = port;

        port.onMessage.addListener(msg => {
          let targetPort: chrome.runtime.Port | null = null;

          switch (msg.from) {
            case PortNames.Content:
              targetPort = ports.Devtools;
              break;
            case PortNames.Devtools:
              targetPort = ports.Content;
              break;
          }
          console.log('targetPort', targetPort);

          targetPort?.postMessage(msg);
        });

        port.onDisconnect.addListener(() => {
          if (portKey) {
            ports[portKey as PortNameType] = null;
          }
        });
      }
    });
  }
}

// 导出类，以便在其他脚本中使用
export default new Communication('hub');
