import config from '@root/tailwind.config';

import { twind, cssom, observe } from '@twind/core';

import 'construct-style-sheets-polyfill';

export function attachTwindStyle<T extends { adoptedStyleSheets: unknown }>(
  observedElement: Element,
  documentOrShadowRoot: T,
) {
  const sheet = cssom(new CSSStyleSheet());
  const tw = twind(config, sheet);
  observe(tw, observedElement);
  documentOrShadowRoot.adoptedStyleSheets = [sheet.target];
}
