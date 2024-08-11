import { MessageNames } from '@root/src/core/constants';

import { useEffect } from 'react';

import { useStore } from '../Context/useStore';

export function useNetTable() {
  const { state, dispatch } = useStore();

  return { state, dispatch };
}
