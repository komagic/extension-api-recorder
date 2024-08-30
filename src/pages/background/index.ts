import { MESSAGES_OF_EXTENSION } from '@src/shared/constant';

import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

import 'webextension-polyfill';

import { injectHandler } from './injectHandler';
reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
// reloadOnUpdate('pages/content/style.scss');
const initMessageHandler = () => {
  chrome.runtime.onMessage.addListener((message, sender) => {
    /* From any case, return true when sendResponse is called asynchronously */
    switch (message.action) {
      case MESSAGES_OF_EXTENSION.START_XHR:
        console.log('start xhr');

        injectHandler({
          tabId: sender.tab?.id,
          frameIds: [sender.frameId],
        });
        // applyScriptRules(sender.tab?.id, sender.frameId, sender.url);
        break;
    }
    return false;
  });
};

initMessageHandler();
