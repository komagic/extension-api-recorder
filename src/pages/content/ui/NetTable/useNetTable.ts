

import { useStore } from '../Context/useStore';

export function useNetTable() {
  const content= useStore();
  return { ...content };
}
