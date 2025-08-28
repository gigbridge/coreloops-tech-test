'use client';

import { useApiInfiniteQuery } from '@/src/api/hooks/use-api-query';
import { useDeletePokemon } from '@/src/api/hooks/use-delete-pokemon';
import { LoadingCard } from '@/src/components/pokemon/loading-card';
import { PokemonCard } from '@/src/components/pokemon/pokemon-card';
import { PokemonDetailModal } from '@/src/components/pokemon/pokemon-detail-modal';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/hooks/use-auth';
import { useGridColumns } from '@/src/hooks/use-grid-columns';
import { useIntersectionObserver } from '@/src/hooks/use-intersection-observer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@coreloops-ui/card';
import { ViewPokemonDto } from '@coreloops/shared-types';
import { Loader2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

export default function Home() {
  const { items, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, raw } =
    useApiInfiniteQuery<ViewPokemonDto>(['pokemon'], '/pokemon', { limit: 25 });

  // Sentinel element we observe to trigger fetching more
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Only observe when there's more to fetch and we're not already fetching
  const canAutoFetch = useMemo(() => hasNextPage && !isFetchingNextPage, [hasNextPage, isFetchingNextPage]);

  useIntersectionObserver(sentinelRef, () => void fetchNextPage(), {
    enabled: canAutoFetch,
  });

  // get the number of columns in a row to render missing column skeletons when fetching next page
  const cols = useGridColumns();

  const trailingSlots = useMemo(() => {
    if (!isFetchingNextPage) return 0;
    if (items.length === 0) return 0;
    const remainder = items.length % cols;
    return remainder === 0 ? 0 : cols - remainder;
  }, [isFetchingNextPage, items.length, cols]);

  // Modal state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { isAdmin } = useAuth();
  // Delete logic via reusable hook
  const { handleDelete } = useDeletePokemon(25);

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">We couldn’t load Pokémon right now. Please try again.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => fetchNextPage()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col p-6">
        <div className="w-full max-w-[80vw] self-center">
          <h1 className="mb-4 text-2xl font-semibold tracking-tight">Pokédex</h1>

          {isLoading && (!items || items.length === 0) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          )}
          {!isLoading && items.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map(p => (
                  <PokemonCard
                    key={p.id}
                    pokemon={p}
                    onView={pokemon => {
                      setSelectedId(pokemon.id);
                      setModalOpen(true);
                    }}
                    {...(isAdmin ? { onDelete: handleDelete, canDelete: true } : {})}
                  />
                ))}

                {trailingSlots > 0 &&
                  Array.from({ length: trailingSlots }).map((_, i) => <LoadingCard key={`sk-${i}`} />)}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                {isFetchingNextPage && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more…
                  </div>
                )}
                {!isFetchingNextPage && hasNextPage && (
                  <Button onClick={() => fetchNextPage()} variant="outline">
                    Load more
                  </Button>
                )}
                {!hasNextPage && items.length > 0 && (
                  <p className="text-muted-foreground text-sm">You’ve reached the end.</p>
                )}
              </div>

              <div ref={sentinelRef} className="h-1 w-full" />
            </>
          )}
        </div>
      </div>
      <PokemonDetailModal open={isModalOpen} onOpenChange={setModalOpen} pokemonId={selectedId} />
    </>
  );
}
