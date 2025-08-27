'use client';

import { useApiInfiniteQuery } from '@/src/api/hooks/use-api-query';
import { showErrorToast, showSuccessToast } from '@/src/lib/error-handling';
import { ViewPokemonDto } from '@coreloops/shared-types';
import { useCallback } from 'react';
import { useDeletePokemon } from './use-delete-pokemon';

export function usePokemonList() {
  // Pokemon list query
  const { items, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useApiInfiniteQuery<ViewPokemonDto>(['pokemon'], '/pokemon', { limit: 25 });

  // Delete functionality
  const { deletePokemon, isDeleting, deleteError } = useDeletePokemon();

  const handleDeletePokemon = useCallback(
    (pokemonId: string) => {
      deletePokemon(pokemonId, {
        onSuccess: () => {
          showSuccessToast('Pokémon deleted successfully', 'The Pokémon has been removed from the Pokédex.');
        },
        onError: (error: unknown) => {
          showErrorToast(error, 'Delete failed');
        },
      });
    },
    [deletePokemon],
  );

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    items,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    handleDeletePokemon,
    isDeleting,
    deleteError,
    handleRetry,
  };
}
