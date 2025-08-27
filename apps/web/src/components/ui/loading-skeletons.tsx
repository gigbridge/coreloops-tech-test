'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';

// Pokemon Card Loading Skeleton
export function PokemonCardSkeleton() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <CardHeader className="pb-2">
        <Skeleton className="skeleton-enhanced h-6 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="skeleton-enhanced mb-2 h-5 w-40" />
        <Skeleton className="skeleton-enhanced h-28 w-full" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="skeleton-enhanced h-6 w-16" />
          <Skeleton className="skeleton-enhanced h-6 w-16" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="skeleton-enhanced h-9 w-16" />
        <Skeleton className="skeleton-enhanced h-9 w-16" />
      </CardFooter>
    </Card>
  );
}

// Pokemon Detail Modal Loading Skeleton
export function PokemonDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="skeleton-enhanced h-8 w-48" />
        <Skeleton className="skeleton-enhanced h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column - Image and basic info */}
        <div className="space-y-4">
          <div className="bg-muted/30 flex items-center justify-center rounded-lg border p-4 sm:p-8">
            <Skeleton className="skeleton-enhanced h-48 w-48" />
          </div>

          {/* Types */}
          <div className="space-y-2">
            <Skeleton className="skeleton-enhanced h-5 w-16" />
            <div className="flex gap-2">
              <Skeleton className="skeleton-enhanced h-8 w-20" />
              <Skeleton className="skeleton-enhanced h-8 w-20" />
            </div>
          </div>

          {/* Abilities */}
          <div className="space-y-2">
            <Skeleton className="skeleton-enhanced h-5 w-20" />
            <div className="space-y-2">
              <Skeleton className="skeleton-enhanced h-4 w-32" />
              <Skeleton className="skeleton-enhanced h-3 w-48" />
            </div>
          </div>
        </div>

        {/* Right column - Moves table */}
        <div className="space-y-4">
          <Skeleton className="skeleton-enhanced h-5 w-16" />
          <MovesTableSkeleton />
        </div>
      </div>
    </div>
  );
}

// Moves Table Loading Skeleton
export function MovesTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="skeleton-enhanced h-4 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="skeleton-enhanced h-4 w-10" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="skeleton-enhanced mx-auto h-4 w-12" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="skeleton-enhanced mx-auto h-4 w-12" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="skeleton-enhanced mx-auto h-4 w-16" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="skeleton-enhanced mx-auto h-4 w-6" />
              </TableHead>
              <TableHead>
                <Skeleton className="skeleton-enhanced h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i} className="animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <TableCell>
                  <Skeleton className="skeleton-enhanced h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="skeleton-enhanced h-6 w-16" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="skeleton-enhanced mx-auto h-4 w-6" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="skeleton-enhanced mx-auto h-4 w-8" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="skeleton-enhanced mx-auto h-4 w-8" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="skeleton-enhanced mx-auto h-4 w-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="skeleton-enhanced h-4 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Grid Loading Skeleton
export function PokemonGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <PokemonCardSkeleton />
        </div>
      ))}
    </div>
  );
}
