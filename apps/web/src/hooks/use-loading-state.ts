'use client';

import { useCallback, useState } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export function useLoadingState(initialState: LoadingState = {}) {
  const [loadingStates, setLoadingStates] = useState<LoadingState>(initialState);

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const isLoading = useCallback((key: string) => loadingStates[key] ?? false, [loadingStates]);

  const isAnyLoading = useCallback(() => Object.values(loadingStates).some(Boolean), [loadingStates]);

  const withLoading = useCallback(
    async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
      setLoading(key, true);
      try {
        return await fn();
      } finally {
        setLoading(key, false);
      }
    },
    [setLoading],
  );

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    withLoading,
    loadingStates,
  };
}
