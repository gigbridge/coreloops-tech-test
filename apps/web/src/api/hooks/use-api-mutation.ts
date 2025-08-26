import { ApiError, apiFetch } from '@/src/api/api-client';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type MutationMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function useApiMutation<TInput, TOutput>(
  path: string,
  method: MutationMethod = 'POST',
  options?: Omit<UseMutationOptions<TOutput, ApiError, TInput>, 'mutationFn'>,
) {
  return useMutation<TOutput, ApiError, TInput>({
    mutationFn: variables => apiFetch<TOutput, TInput>(path, { method, body: variables }),
    ...options,
  });
}
