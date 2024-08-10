import communication from '@root/src/core/Communication';

import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';

import refreshOnUpdate from 'virtual:reload-on-update-in-view';

import RequestInterceptor from '../extension/RequestInterceptor';

import { ah } from './ajaxhook/cdn.js';

refreshOnUpdate('pages/content/injected/toggleTheme');

async function toggleTheme() {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'abbc';
  script.src = chrome.runtime.getURL('assets/js/xhr.js');
  document.body.appendChild(script);

  // 使用拦截器

  // console.log('initial theme!', await exampleThemeStorage.get());
  // await exampleThemeStorage.toggle();
  // console.log('toggled theme', await exampleThemeStorage.get());

  try {
    setInterval(() => {
      const port = communication.connect({ name: 'content-script' });
      // 向 DevTools 面板发送消息
      port.postMessage({ from: 'content-script', message: 'Hello from the Content Script!' });

      // 可选：监听来自 DevTools 面板的消息
      port.onMessage.addListener(msg => {
        console.log('Received message from background/devtools page:', msg);
      });
    }, 1000);
  } catch (error) {
    console.error(error);
  }
  // 在页面上插入代码
}

void toggleTheme();
