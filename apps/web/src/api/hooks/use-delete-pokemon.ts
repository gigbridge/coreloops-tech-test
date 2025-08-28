import { apiFetch } from '@/src/api/api-client';
import type { Connection } from '@coreloops/shared-types';
import { ViewPokemonDto } from '@coreloops/shared-types';
import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type MutationContext = {
  previous?: InfiniteData<Connection<ViewPokemonDto>>;
};

export function useDeletePokemon(pageSize = 25) {
  const queryClient = useQueryClient();
  const pokemonQueryKey = [['pokemon'], pageSize] as const;

  const mutation = useMutation<ViewPokemonDto, unknown, ViewPokemonDto, MutationContext>({
    mutationFn: async (pokemon: ViewPokemonDto) => {
      await apiFetch(`/pokemon/${pokemon.id}`, { method: 'DELETE' });
      return pokemon;
    },
    onMutate: async (pokemon: ViewPokemonDto) => {
      await queryClient.cancelQueries({ queryKey: pokemonQueryKey });

      const previous = queryClient.getQueryData<InfiniteData<Connection<ViewPokemonDto>>>(pokemonQueryKey);

      queryClient.setQueryData<InfiniteData<Connection<ViewPokemonDto>>>(pokemonQueryKey, old => {
        if (!old) return old;
        const pages = old.pages.map(page => ({
          ...page,
          nodes: page.nodes.filter((n: ViewPokemonDto) => n.id !== pokemon.id),
          pageInfo: {
            ...page.pageInfo,
            total: Math.max(0, (page.pageInfo.total ?? 0) - 1),
          },
        }));
        return { ...old, pages };
      });

      return { previous };
    },
    onError: (_err, _pokemon, context) => {
      if (context?.previous) {
        queryClient.setQueryData(pokemonQueryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: pokemonQueryKey });
    },
  });

  const handleDelete = (pokemon: ViewPokemonDto) => {
    mutation.mutate(pokemon);
  };

  return { deletePokemonMutation: mutation, handleDelete };
}
