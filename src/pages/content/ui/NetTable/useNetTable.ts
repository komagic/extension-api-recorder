

import { useStore } from '../Context/useStore';

export function useNetTable() {
  const { state, dispatch } = useStore();

  return { state, dispatch };
}
