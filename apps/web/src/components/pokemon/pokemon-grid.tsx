'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ErrorBoundary } from '@/src/components/ui/error-boundary';
import { PokemonCardSkeleton, PokemonGridSkeleton } from '@/src/components/ui/loading-skeletons';
import { getErrorMessage, parseError } from '@/src/lib/error-handling';
import { ViewPokemonDto } from '@coreloops/shared-types';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PokemonCard } from './pokemon-card';

interface PokemonGridProps {
  items: ViewPokemonDto[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isAdmin: boolean;
  onViewPokemon: (pokemonId: string) => void;
  onDeletePokemon: (pokemonId: string) => void;
  onFetchNextPage: () => void;
  onRetry: () => void;
}

function useGridColumns() {
  const [cols, setCols] = useState(1);

  useEffect(() => {
    // Tailwind defaults we're using: 1 (base), 2 (sm≥640), 3 (lg≥1024), 4 (xl≥1280)
    const qXL = window.matchMedia('(min-width: 1280px)');
    const qLG = window.matchMedia('(min-width: 1024px)');
    const qSM = window.matchMedia('(min-width: 640px)');

    const update = () => {
      if (qXL.matches) setCols(4);
      else if (qLG.matches) setCols(3);
      else if (qSM.matches) setCols(2);
      else setCols(1);
    };

    update();
    qXL.addEventListener('change', update);
    qLG.addEventListener('change', update);
    qSM.addEventListener('change', update);
    return () => {
      qXL.removeEventListener('change', update);
      qLG.removeEventListener('change', update);
      qSM.removeEventListener('change', update);
    };
  }, []);

  return cols;
}

function ErrorCard({ error, onRetry }: { error?: unknown; onRetry: () => void }) {
  const parsedError = parseError(error);
  const errorMessage = getErrorMessage(parsedError);

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{errorMessage}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onRetry} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PokemonGrid({
  items,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  isAdmin,
  onViewPokemon,
  onDeletePokemon,
  onFetchNextPage,
  onRetry,
}: PokemonGridProps) {
  const cols = useGridColumns();

  // Calculate trailing skeleton slots for loading next page
  const trailingSlots = useMemo(() => {
    if (!isFetchingNextPage) return 0;
    if (items.length === 0) return 0;
    const remainder = items.length % cols;
    return remainder === 0 ? 0 : cols - remainder;
  }, [isFetchingNextPage, items.length, cols]);

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl">
        <ErrorCard error={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {/* Initial loading skeletons */}
      {isLoading && (!items || items.length === 0) && <PokemonGridSkeleton count={8} />}

      {/* Grid of Pokémon cards */}
      {!isLoading && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {items.map((pokemon, index) => (
              <div
                key={pokemon.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${(index % 20) * 50}ms` }}
              >
                <PokemonCard pokemon={pokemon} isAdmin={isAdmin} onView={onViewPokemon} onDelete={onDeletePokemon} />
              </div>
            ))}

            {/* While fetching next page, fill remaining slots of the current row with skeletons */}
            {trailingSlots > 0 &&
              Array.from({ length: trailingSlots }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="animate-in fade-in duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <PokemonCardSkeleton />
                </div>
              ))}
          </div>

          {/* Fetching spinner + manual fallback button */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {isFetchingNextPage && (
              <div className="text-muted-foreground animate-in fade-in flex items-center gap-2 text-sm duration-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more…
              </div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <Button
                onClick={onFetchNextPage}
                variant="outline"
                className="focus:ring-primary/20 transition-all duration-200 hover:scale-105 focus:scale-105 focus:ring-2"
              >
                Load more
              </Button>
            )}
            {!hasNextPage && items.length > 0 && (
              <p className="text-muted-foreground animate-in fade-in text-sm duration-500">You've reached the end.</p>
            )}
          </div>
        </>
      )}
    </ErrorBoundary>
  );
}
