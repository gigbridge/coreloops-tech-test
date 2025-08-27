import { ViewPokemonDto } from '@coreloops/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api-client';
import { useApiQuery } from './use-api-query';

export function usePokemonDetail(pokemonId: string | null) {
  return useApiQuery<ViewPokemonDto>(['pokemon', 'detail', pokemonId], `/pokemon/${pokemonId}`, undefined, {
    enabled: !!pokemonId,
  });
}

export function usePokemonDelete() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, { previousPokemonList: unknown }>({
    mutationFn: async (pokemonId: string) => {
      await apiFetch<void>(`/pokemon/${pokemonId}`, { method: 'DELETE' });
    },
    onMutate: async (pokemonId: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['pokemon'] });

      // Snapshot the previous value for rollback
      const previousPokemonList = queryClient.getQueryData(['pokemon']);

      // Optimistically remove the pokemon from the list
      queryClient.setQueryData(['pokemon'], (oldData: unknown) => {
        if (!oldData || typeof oldData !== 'object' || !('pages' in oldData)) {
          return oldData;
        }

        const typedData = oldData as { pages: Array<{ nodes: ViewPokemonDto[] }> };

        return {
          ...typedData,
          pages: typedData.pages.map(page => ({
            ...page,
            nodes: page.nodes.filter((pokemon: ViewPokemonDto) => pokemon.id !== pokemonId),
          })),
        };
      });

      // Remove the individual pokemon detail from cache
      queryClient.removeQueries({ queryKey: ['pokemon', 'detail', pokemonId] });

      return { previousPokemonList };
    },
    onError: (_err, _pokemonId, context) => {
      // Rollback optimistic update on error
      if (context?.previousPokemonList) {
        queryClient.setQueryData(['pokemon'], context.previousPokemonList);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      void queryClient.invalidateQueries({ queryKey: ['pokemon'] });
    },
  });
}
