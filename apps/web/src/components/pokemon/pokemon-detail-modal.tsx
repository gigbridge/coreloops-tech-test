'use client';

import { usePokemonDetail } from '@/src/api/hooks/use-pokemon';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { ErrorBoundary } from '@/src/components/ui/error-boundary';
import { PokemonDetailSkeleton } from '@/src/components/ui/loading-skeletons';
import { useFocusTrap } from '@/src/hooks/use-focus-trap';
import { getErrorMessage, parseError } from '@/src/lib/error-handling';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { MovesTable } from './moves-table';

interface PokemonDetailModalProps {
  pokemonId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDexNo(n: number) {
  return `#${String(n).padStart(3, '0')}`;
}

function PokemonDetailError({ error, onRetry, onClose }: { error: unknown; onRetry: () => void; onClose: () => void }) {
  const parsedError = parseError(error);
  const errorMessage = getErrorMessage(parsedError);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Failed to Load Pokémon
        </DialogTitle>
        <DialogDescription>{errorMessage}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex gap-2">
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button onClick={onClose} variant="secondary" size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PokemonDetailModal({ pokemonId, isOpen, onClose }: PokemonDetailModalProps) {
  const { data: pokemon, isLoading, isError, error, refetch } = usePokemonDetail(pokemonId);
  const focusTrapRef = useFocusTrap(isOpen);

  const handleRetry = () => {
    void refetch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={focusTrapRef}
        className="max-h-[90vh] max-w-[95vw] overflow-y-auto focus:outline-none sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
      >
        <ErrorBoundary>
          {isLoading && <PokemonDetailSkeleton />}

          {isError && <PokemonDetailError error={error} onRetry={handleRetry} onClose={onClose} />}

          {pokemon && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-muted-foreground">{formatDexNo(pokemon.pokedexNumber)}</span>
                  <span>{pokemon.name}</span>
                </DialogTitle>
                <DialogDescription>
                  View detailed information about {pokemon.name}, including types, abilities, and moves.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Pokemon Image and Basic Info */}
                <div className="space-y-4">
                  <div className="bg-muted/30 hover:bg-muted/50 flex items-center justify-center rounded-lg border p-4 transition-all duration-300 sm:p-8">
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`}
                      alt={pokemon.name}
                      width={200}
                      height={200}
                      className="pixelated transition-transform duration-300 hover:scale-110"
                    />
                  </div>

                  {/* Types */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.map((type, index) => (
                        <div
                          key={type.id}
                          className="bg-muted/20 hover:bg-muted/40 flex items-center gap-2 rounded-lg border p-2 transition-all duration-200 hover:scale-105"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Image
                            src={type.iconUrl}
                            alt={type.name}
                            width={60}
                            height={45}
                            className="rounded transition-transform duration-200 hover:scale-110"
                          />
                          <span className="text-sm font-medium capitalize">{type.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Abilities */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Abilities</h3>
                    <div className="space-y-2">
                      {pokemon.abilities.map((ability, index) => (
                        <div
                          key={ability.id}
                          className="bg-muted/20 hover:bg-muted/40 rounded-lg border p-3 text-sm transition-all duration-200 hover:shadow-sm"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <span className="font-medium capitalize">{ability.name}</span>
                          {ability.description && (
                            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{ability.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Moves Table */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Moves</h3>
                  {pokemon.moves && pokemon.moves.length > 0 ? (
                    <MovesTable moves={pokemon.moves} isLoading={isLoading} />
                  ) : (
                    <div className="text-muted-foreground flex h-32 items-center justify-center rounded-md border">
                      No moves available for this Pokémon.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
