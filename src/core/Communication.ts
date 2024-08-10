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
    let ports = this.ports;
    console.log('ports:', ports);

    // 添加连接监听器
    chrome.runtime.onConnect.addListener(port => {
      // 判断端口类型并存储
      if (port.name === 'devtools-page') {
        ports.devtool = port;
      } else if (port.name === 'content-script') {
        ports.content = port;
      }

      // 添加消息监听器
      port.onMessage.addListener(msg => {
        console.log('background msg', msg);

        // 根据消息来源进行消息转发
        // 根据消息来源进行消息转发
        if (msg.from === 'content-script' && ports.devtool) {
          ports.devtool.postMessage(msg);
        } else if (msg.from === 'devtools-page' && ports.content) {
          ports.content.postMessage(msg);
        }
      });

      // 添加断开连接监听器
      port.onDisconnect.addListener(() => {
        // 判断端口类型并存储
        if (port.name === 'devtools-page') {
          ports.devtool = null;
        } else if (port.name === 'content-script') {
          ports.content = null;
        }
      });
    });
  }
}

// 导出类，以便在其他脚本中使用
export default new Communication('hub');
