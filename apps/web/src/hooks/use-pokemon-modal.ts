'use client';

import { useCallback, useState } from 'react';

export function usePokemonModal() {
  const [selectedPokemonId, setSelectedPokemonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewPokemon = useCallback((pokemonId: string) => {
    setSelectedPokemonId(pokemonId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPokemonId(null);
  }, []);

  return {
    selectedPokemonId,
    isModalOpen,
    handleViewPokemon,
    handleCloseModal,
  };
}
