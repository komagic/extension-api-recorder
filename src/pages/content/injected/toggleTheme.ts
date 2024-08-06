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
  // window.addEventListener('message',(e)=>{
  //   console.log('message',e?.data);
  //   chrome.runtime.sendMessage({
  //     data:e.data,
  //     type:'ajaxResponse'
  //   })
  // })
  // 在页面上插入代码
}

void toggleTheme();
