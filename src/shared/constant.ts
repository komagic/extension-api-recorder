export const PUBLIC_NAMESPACE = '__APIRECORDER__';

export const PANEL_ROOT = 'API_RECORDER_PANEL';

export const XHR_ROOT = 'API_RECORDER_XHR';

export const DEFAULT_RULES = ['/api', '.json', '/admin', '/detail'];

// main panel z-index
export const Z_INDEX_MAIN = 2090;

export const MESSAGES_OF_EXTENSION = {
  START_XHR: 'START_XHR',
  CLEAR_CACHE: 'CLEAR_CACHE',

  // localstorage save to store
  SAVE_TO_STORE: 'SAVE_TO_STORE',

  // indexeddb save to store
  INDEXED_DB_CLEAR: 'INDEXED_DB_CLEAR',
};
export const STORE_PROPERTY = 'api_recorder_store';

export const cache_state = '_api_recorder_';
export const cache_requests = '_api_recorder_requests_';