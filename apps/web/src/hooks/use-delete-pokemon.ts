'use client';

import { usePokemonDelete } from '@/src/api/hooks/use-pokemon';

export function useDeletePokemon() {
  const mutation = usePokemonDelete();

  return {
    deletePokemon: mutation.mutate,
    isDeleting: mutation.isPending,
    deleteError: mutation.error,
    isDeleteSuccess: mutation.isSuccess,
  };
}
