import { MessageNames } from '@root/src/core/constants';

import { useEffect } from 'react';

import { useStore } from '../Context/useStore';

export function useNetTable() {
  const { state, dispatch } = useStore();
  const handler = (e: MessageEvent<any>) => {
    const { type, data, url } = e?.data;
    dispatch({
      type: MessageNames.XHR,
      payload: data,
      url,
    });
  };

  //   回显mock数据
  const mockData = () => {};

  useEffect(() => {
    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  return { state, dispatch };
}
