'use client';

import { usePokemonDetail } from '@/src/api/hooks/use-pokemon';

export function usePokemonWithMoves(pokemonId: string | null) {
  const { data: pokemon, isLoading, isError, error, refetch } = usePokemonDetail(pokemonId);

  return {
    pokemon,
    isLoading,
    isError,
    error,
    refetch,
    moves: pokemon?.moves || [],
  };
}
