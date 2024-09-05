import { XHR_ROOT } from '@root/src/shared/constant';

import refreshOnUpdate from 'virtual:reload-on-update-in-view';
refreshOnUpdate('pages/content/injected/toggleTheme');

async function toggleTheme() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.type = 'module';

  script.id = XHR_ROOT;
  script.src = chrome.runtime.getURL(`assets/js/xhr.js`);
  script.type = 'module';
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('assets/css/contentStyle.chunk.css');
  if (document.doctype?.name === 'html') {
    // chrome.runtime.sendMessage({ action: MESSAGES_OF_EXTENSION.START_XHR });
    document.head.insertBefore(script,document.head.firstChild);
    document.head.insertBefore(link, document.head.firstChild);

    // 页面脚本 (content.js)
    window.addEventListener(
      'message',
      function (event) {
        // 确保消息来自可信的源
        // if (event.source !== window) return;
        
        if(event.origin !==window.location.origin) return;

        if (event.data.type && event.data.type === 'INJECT_TO_BACKGROUND') {

          // 发送消息到 background.js
          // chrome.runtime.sendMessage({ message: event.data.message, type: event.data.type });
          chrome.runtime.sendMessage({action: event.data.action });
        }
      },
      false,
    );
  }

  

  // 使用拦截器

  // console.log('initial theme!', await exampleThemeStorage.get());
  // await exampleThemeStorage.toggle();
  // console.log('toggled theme', await exampleThemeStorage.get());

  // 在页面上插入代码
}

void toggleTheme();
