import { useState, useEffect } from 'react';

export default function useScroller(wrapper) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const handleScroll = () => {
    if (wrapper.scrollTop > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };
  useEffect(() => {
    wrapper?.addEventListener('scroll', handleScroll);
    return () => {
      wrapper?.removeEventListener('scroll', handleScroll);
    };
  }, [wrapper,handleScroll]);

  return { isScrolled };
}
