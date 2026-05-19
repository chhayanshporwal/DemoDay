// ==========================================
// useIntersection Hook — IntersectionObserver
// Used for video autoplay-on-scroll & lazy loading
// ==========================================

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
  freezeOnceVisible?: boolean;
}

export function useIntersection({
  threshold = 0.5,
  rootMargin = '0px',
  root = null,
  freezeOnceVisible = false,
}: UseIntersectionOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const frozen = useRef(false);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || (freezeOnceVisible && frozen.current)) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        setIsIntersecting(observerEntry.isIntersecting);

        if (observerEntry.isIntersecting && freezeOnceVisible) {
          frozen.current = true;
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, freezeOnceVisible]);

  return { ref: setRef, isIntersecting, entry };
}

export default useIntersection;
