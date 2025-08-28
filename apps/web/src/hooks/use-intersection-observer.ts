'use client';

import { RefObject, useEffect } from 'react';

type Options = IntersectionObserverInit & { enabled?: boolean };

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  onIntersect: () => void,
  { root = null, rootMargin = '200px', threshold = 0, enabled = true }: Options = {},
) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) onIntersect();
    }, { root, rootMargin, threshold });

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, [ref, onIntersect, root, rootMargin, threshold, enabled]);
}


