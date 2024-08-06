/**
 * DO NOT USE import someModule from '...';
 *
 * @issue-url https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/160
 *
 * Chrome extensions don't support modules in content scripts.
 * If you want to use other modules in content scripts, you need to import them via these files.
 *
 */

import('@pages/content/injected/toggleTheme');
import('@pages/content/injected/xhr');

// const script = document.createElement('script');
// script.id="nihaoma"
// // script.setAttribute('type', 'text/javascript');
// script.setAttribute('src', chrome.runtime.getURL('../injected/toggleTheme.ts'));

// script.setAttribute('id', "request-proxy-wrapper");
