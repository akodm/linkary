import { useCallback, useEffect, useRef, useState } from 'react';

export default function useHasScroll() {
  const [hasScroll, setHasScroll] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const containerRef = useRef<HTMLElement | null>(null);

  const onScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;

    if (target.scrollTop > 0) {
      setHasScroll(true);
      setIsTop(false);
    } else {
      setHasScroll(false);
      setIsTop(true);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('scroll', onScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', onScroll);
      }
    };
  }, [onScroll]);

  return {
    hasScroll,
    isTop,
    containerRef,
  };
}
