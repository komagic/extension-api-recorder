import { createRoot } from 'react-dom/client';
import App from '@root/src/pages/content/ui/app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectedStyle from './injected.css?inline';
refreshOnUpdate('pages/content');
const root = document.createElement('div');
root.id = 'api-recorder-float-panel';
document.body.append(root);
const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';
const styleElement = document.createElement('style');
styleElement.innerHTML = injectedStyle;
// root.appendChild(styleElement)
document.body.append(styleElement);
// const shadowRoot = root.attachShadow({ mode: 'open' });
// shadowRoot.appendChild(rootIntoShadow);
/** Inject styles into shadow dom */
// const styleElement = document.createElement('style');
// styleElement.innerHTML = injectedStyle;
// shadowRoot.appendChild(styleElement);

/**
 * https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/pull/174
 *
 * In the firefox environment, the adoptedStyleSheets bug may prevent contentStyle from being applied properly.
 * Please refer to the PR link above and go back to the contentStyle.css implementation, or raise a PR if you have a better way to improve it.
 */
createRoot(root).render(<App />);

// createRoot(rootIntoShadow).render(<App />);
