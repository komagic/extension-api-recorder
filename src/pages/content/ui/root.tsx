import { createRoot } from 'react-dom/client';
import App from '@root/src/pages/content/ui/app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectedStyle from './injected.css?inline';
import { PANEL_ROOT } from '@root/src/shared/constant';
refreshOnUpdate('pages/content');
const root = document.createElement('div');
root.id = PANEL_ROOT;
document.body.append(root);
// const rootIntoShadow = document.createElement('div');
// rootIntoShadow.id = 'shadow-root';
const styleElement = document.createElement('style');

styleElement.innerHTML = injectedStyle;
// root.appendChild(styleElement)
document.body.append(styleElement);
// createRoot(rootIntoShadow).render(<App />);
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

const the_root = createRoot(root);
the_root.render(<App />);

// createRoot(rootIntoShadow).render(<App />);
