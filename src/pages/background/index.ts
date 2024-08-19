
// import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

// import 'webextension-polyfill';

// reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
// reloadOnUpdate('pages/content/style.scss');

// function logRequest(details) {
//   console.log('Logged request from background:', details);
// }

// 作为content script 与 devtool 通信的桥
// let ports = {};
// console.log('ports:', ports);

// // 添加连接监听器
// chrome.runtime.onConnect.addListener(port => {
//   // 判断端口类型并存储
//   if (port.name === 'devtools-page') {
//     ports.devtool = port;
//   } else if (port.name === 'content-script') {
//     ports.content = port;
//   }

//   // 添加消息监听器
//   port.onMessage.addListener(msg => {
//     console.log('background msg', msg);

//     // 根据消息来源进行消息转发
//     // 根据消息来源进行消息转发
//     if (msg.from === 'content-script' && ports.devtool) {
//       ports.devtool.postMessage(msg);
//     } else if (msg.from === 'devtools-page' && ports.content) {
//       ports.content.postMessage(msg);
//     }
//   });

//   // 添加断开连接监听器
//   port.onDisconnect.addListener(() => {
//     // 判断端口类型并存储
//     if (port.name === 'devtools-page') {
//       ports.devtool = null;
//     } else if (port.name === 'content-script') {
//       ports.content = null;
//     }
//   });
// });
const ports:{
  devtool?: any,
  content?: any
} = {};

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'devtools-page') {
    ports.devtool = port;
  } else if (port.name === 'content-script') {
    ports.content = port;
  }

  port.onMessage.addListener(msg => {
    if (msg.from === 'content-script' && ports.devtool) {
      ports.devtool.postMessage(msg);
    } else if (msg.from === 'devtools-page' && ports.content) {
      ports.content.postMessage(msg);
    }
  });

  port.onDisconnect.addListener(() => {
    if (port.name === 'devtools-page') {
      ports.devtool = null;
    } else if (port.name === 'content-script') {
      ports.content = null;
    }
  });
});
