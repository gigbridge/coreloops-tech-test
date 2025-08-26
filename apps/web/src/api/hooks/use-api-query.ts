import { Connection } from '@coreloops/shared-types';
import { QueryKey, useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ApiError, apiFetch, QueryParams } from '../api-client';

export function useApiQuery<TData>(
  key: QueryKey,
  path: string,
  query?: QueryParams,
  options?: Omit<UseQueryOptions<TData, ApiError, TData>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData, ApiError, TData>({
    queryKey: key,
    queryFn: ({ signal }) => apiFetch<TData>(path, { method: 'GET', query, signal }),
    ...options,
  });
}

type InfiniteParams = {
  limit?: number;
  afterId?: string | null;
};

type UseApiInfiniteListResult<TNode> = {
  // merged list
  items: TNode[];
  // metadata
  total: number;
  pageInfo: {
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  // passthrough controls/state
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  refetch: () => Promise<unknown>;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  // raw for advanced use (optional)
  raw: ReturnType<typeof useInfiniteQuery<Connection<TNode>, ApiError>>;
};

export function useApiInfiniteQuery<TNode>(
  key: QueryKey,
  path: string,
  initialParams: InfiniteParams = { limit: 20, afterId: null },
): UseApiInfiniteListResult<TNode> {
  const query = useInfiniteQuery<Connection<TNode>, ApiError>({
    queryKey: [key, initialParams.limit], // include limit so it refetches when it changes
    queryFn: ({ pageParam, signal }) => {
      const params: QueryParams = {
        limit: initialParams.limit ?? 20,
        afterId: (pageParam as string | null) ?? initialParams.afterId ?? undefined,
      };
      return apiFetch<Connection<TNode>>(path, { method: 'GET', query: params, signal });
    },
    initialPageParam: initialParams.afterId ?? null,
    getNextPageParam: lastPage => (lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined),
  });

  // Merge pages to a single flat list
  const items = useMemo(() => query.data?.pages.flatMap(p => p.nodes) ?? [], [query.data]);

  // Derive metadata from the latest page (endCursor/hasNextPage) and first page (total)
  const latest = query.data?.pages.at(-1);
  const first = query.data?.pages[0];

  return {
    items,
    total: first?.pageInfo.total ?? 0,
    pageInfo: {
      endCursor: latest?.pageInfo.endCursor ?? null,
      hasNextPage: latest?.pageInfo.hasNextPage ?? false,
      hasPreviousPage: first?.pageInfo.hasPreviousPage ?? false,
    },
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: query.refetch,
    isLoading: query.isLoading,
    isError: query.isError,
    error: (query.error as ApiError) ?? null,
    raw: query,
  } as const;
}
