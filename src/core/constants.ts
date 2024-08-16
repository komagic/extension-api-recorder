export const PortNames = {
  Devtools: 'devtools-page',
  Content: 'content-script',
} as const;

export const MessageNames = {
  XHR: 'XHR',
  FETCH: 'FETCH',
  REQUEST: 'REQUEST',
} as const;
export type PortNameType = keyof typeof PortNames;

export type MessageNameType = keyof typeof MessageNames;
