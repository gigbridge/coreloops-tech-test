'use client';

import { RetryManager, showErrorToast, showSuccessToast } from '@/src/lib/error-handling';
import { useCallback, useState } from 'react';

interface UseErrorHandlingOptions {
  maxRetries?: number;
  baseDelay?: number;
  onSuccess?: (message?: string) => void;
  onError?: (error: unknown) => void;
}

export function useErrorHandling(options: UseErrorHandlingOptions = {}) {
  const { maxRetries = 3, baseDelay = 1000, onSuccess, onError } = options;
  const [retryManager] = useState(() => new RetryManager(maxRetries, baseDelay));
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(
    async <T>(fn: () => Promise<T>, successMessage?: string): Promise<T | null> => {
      setIsRetrying(true);
      try {
        const result = await retryManager.execute(fn);
        if (successMessage) {
          showSuccessToast('Success', successMessage);
        }
        onSuccess?.(successMessage);
        return result;
      } catch (error) {
        showErrorToast(error);
        onError?.(error);
        return null;
      } finally {
        setIsRetrying(false);
      }
    },
    [retryManager, onSuccess, onError],
  );

  const handleError = useCallback(
    (error: unknown, title?: string) => {
      showErrorToast(error, title);
      onError?.(error);
    },
    [onError],
  );

  const handleSuccess = useCallback(
    (title: string, description?: string) => {
      showSuccessToast(title, description);
      onSuccess?.(description);
    },
    [onSuccess],
  );

  return {
    executeWithRetry,
    handleError,
    handleSuccess,
    isRetrying,
    canRetry: retryManager.canRetry,
    attemptsRemaining: retryManager.attemptsRemaining,
  };
}
