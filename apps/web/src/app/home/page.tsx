'use client';

import { InfiniteScrollSentinel, PokemonDetailModal, PokemonGrid } from '@/src/components/pokemon';
import { ErrorBoundary } from '@/src/components/ui/error-boundary';
import { useAuth } from '@/src/hooks/use-auth';
import { usePokemonList } from '@/src/hooks/use-pokemon-list';
import { usePokemonModal } from '@/src/hooks/use-pokemon-modal';

export default function Home() {
  const { isAdmin } = useAuth();

  // Pokemon list state and actions
  const {
    items,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    handleDeletePokemon,
    handleRetry,
  } = usePokemonList();

  // Modal state and actions
  const { selectedPokemonId, isModalOpen, handleViewPokemon, handleCloseModal } = usePokemonModal();

  return (
    <ErrorBoundary>
      <div className="flex flex-col p-4 sm:p-6">
        <div className="w-full max-w-[95vw] self-center sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="animate-in fade-in slide-in-from-left-4 text-2xl font-semibold tracking-tight duration-500 sm:text-3xl">
              Pokédex
            </h1>
            {isAdmin && (
              <div className="animate-in fade-in slide-in-from-right-4 admin-badge flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 shadow-sm transition-all delay-200 duration-200 duration-500 hover:bg-blue-100 hover:shadow-md">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 2.676-.732 5.016-2.297 6.618-4.016A11.955 11.955 0 0021 9a12.02 12.02 0 00-.382-3.016z"
                  />
                </svg>
                Admin Mode
              </div>
            )}
          </div>

          <PokemonGrid
            items={items}
            isLoading={isLoading}
            isError={isError}
            error={error}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isAdmin={isAdmin}
            onViewPokemon={handleViewPokemon}
            onDeletePokemon={handleDeletePokemon}
            onFetchNextPage={fetchNextPage}
            onRetry={handleRetry}
          />

          {/* Infinite scroll sentinel */}
          <InfiniteScrollSentinel
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onFetchNextPage={fetchNextPage}
          />
        </div>

        {/* Pokemon Detail Modal */}
        <PokemonDetailModal pokemonId={selectedPokemonId} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </ErrorBoundary>
  );
}
