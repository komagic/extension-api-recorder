import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

chrome.webRequest.onCompleted.addListener(
  function (details) {
    console.log('Request completed:', details);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length === 0) return;
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: logRequest,
        args: [details],
      });
    });
  },
  { urls: ['<all_urls>'] },
);

function logRequest(details) {
  console.log('Logged request from background:', details);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ajaxResponse') {
    console.log('ajaxResponse:', request);
    return true;
  }
});
