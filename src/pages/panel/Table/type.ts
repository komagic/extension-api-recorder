export enum NetworkResourceType {
  FETCH = 'fetch',
  XHR = 'xhr',
  JS = 'script',
  CSS = 'stylesheet',
  IMG = 'image',
  MEDIA = 'media',
  FONT = 'font',
  DOC = 'document',
  WEBSOCKET = 'websocket',
  WASM = 'wasm',
  MANIFEST = 'manifest',
  OTHER = 'other',
}

export type NetworkEvent = chrome.devtools.network.Request & {
  _resourceType?: NetworkResourceType;
};
