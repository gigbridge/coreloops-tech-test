'use client';

import { useApiInfiniteQuery } from '@/src/api/hooks/use-api-query';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@coreloops-ui/card';
import { ViewPokemonDto } from '@coreloops/shared-types';
import { Loader2, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

function formatDexNo(n: number) {
  return `#${String(n).padStart(3, '0')}`;
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

export default function Home() {
  const { items, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useApiInfiniteQuery<ViewPokemonDto>(['pokemon'], '/pokemon', { limit: 25 });

  // Sentinel element we observe to trigger fetching more
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Only observe when there's more to fetch and we're not already fetching
  const canAutoFetch = useMemo(() => hasNextPage && !isFetchingNextPage, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!sentinelRef.current || !canAutoFetch) return;

    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first?.isIntersecting) {
          void fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, [canAutoFetch, fetchNextPage]);

  // get the number of columns in a row to render missing column skeletons when fetching next page
  const cols = useGridColumns();
  const trailingSlots = useMemo(() => {
    if (!isFetchingNextPage) return 0;
    if (items.length === 0) return 0;
    const remainder = items.length % cols;
    return remainder === 0 ? 0 : cols - remainder;
  }, [isFetchingNextPage, items.length, cols]);

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
    <div className="flex flex-col p-6">
      <div className="w-full max-w-[80vw] self-center">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">Pokédex</h1>

        {/* Initial loading skeletons */}
        {isLoading && (!items || items.length === 0) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-5 w-40" />
                  <Skeleton className="h-28 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && items.length > 0 && (
          <>
            {/* Grid of Pokémon cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map(p => (
                <Card key={p.id} className="group transition">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="text-muted-foreground">{formatDexNo(p.pokedexNumber)}</span>
                      <span className="truncate font-semibold">{p.name}</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-1 flex-col items-center gap-2">
                      <div className="bg-muted/30 flex h-32 w-full items-center justify-center rounded-md border">
                        <Image
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokedexNumber}.png`}
                          alt={p.name}
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {p.types.map(t => {
                          return <Image key={t.id} src={t.iconUrl} alt={t.name} width={100} height={75} />;
                        })}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex w-full flex-row items-center justify-between gap-2">
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="text-destructive size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {/* While fetching next page, fill remaining slots of the current row with skeletons */}
              {trailingSlots > 0 &&
                Array.from({ length: trailingSlots }).map((_, i) => (
                  <Card key={`sk-${i}`} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="mb-2 h-5 w-40" />
                      <Skeleton className="h-28 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-24" />
                    </CardFooter>
                  </Card>
                ))}
            </div>

            {/* Fetching spinner + manual fallback button */}
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

            {/* Sentinel: sits below the list; when it enters viewport we auto-fetch */}
            <div ref={sentinelRef} className="h-1 w-full" />
          </>
        )}
      </div>
    </div>
  );
}
