// content localstorage message center

import { MESSAGES_OF_EXTENSION } from '@root/src/shared/constant';
import { saveToStore } from '@root/src/shared/store/local-store';

import AppStore from '../Context/AppStore';

export default function registerMessageCenter() {
  // 这个脚本可以在页面上下文中执行以访问 localStorage。
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case MESSAGES_OF_EXTENSION.SAVE_TO_STORE: {
        saveToStore(request.key, request.value);
        return;
      }

      case MESSAGES_OF_EXTENSION.INDEXED_DB_CLEAR: {
       AppStore.clear();
       setTimeout(() => {
       window.location.reload();
       }, 0);
        return;
      }

      default:
        break;
    }
  });
}
