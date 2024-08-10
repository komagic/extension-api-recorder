import Communication from '@root/src/core/Communication';

import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

// function logRequest(details) {
//   console.log('Logged request from background:', details);
// }

// 作为content script 与 devtool 通信的桥
Communication.setupBgMessageHub();
