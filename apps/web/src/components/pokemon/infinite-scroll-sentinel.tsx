'use client';

import { useEffect, useMemo, useRef } from 'react';

interface InfiniteScrollSentinelProps {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
}

export function InfiniteScrollSentinel({
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Only observe when there's more to fetch and we're not already fetching
  const canAutoFetch = useMemo(() => hasNextPage && !isFetchingNextPage, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!sentinelRef.current || !canAutoFetch) return;

    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first?.isIntersecting) {
          onFetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, [canAutoFetch, onFetchNextPage]);

  return <div ref={sentinelRef} className="h-1 w-full" />;
}
