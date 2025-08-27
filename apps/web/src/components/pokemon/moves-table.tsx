'use client';

import { MovesTableSkeleton } from '@/src/components/ui/loading-skeletons';
import { Button } from '@coreloops-ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@coreloops-ui/table';
import { PokemonMoveDto } from '@coreloops/shared-types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MoveRow } from './move-row';

interface MovesTableProps {
  moves: PokemonMoveDto[];
  isLoading?: boolean;
}

type SortField = 'level' | 'power';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export function MovesTable({ moves, isLoading = false }: MovesTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'level',
    order: 'asc',
  });

  const sortedMoves = useMemo(() => {
    const sorted = [...moves].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortConfig.field === 'level') {
        aValue = a.level;
        bValue = b.level;
      } else {
        // For power, treat null values as 0 for sorting
        aValue = a.move.power ?? 0;
        bValue = b.move.power ?? 0;
      }

      if (sortConfig.order === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }, [moves, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return null;
    }
    return sortConfig.order === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  if (isLoading) {
    return <MovesTableSkeleton />;
  }

  if (moves.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center">
        No moves available for this Pokémon.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 transition-colors duration-200">
              <TableHead className="font-semibold">Move</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { handleSort('level'); }}
                  className="text-muted-foreground hover:text-foreground focus:ring-primary/20 h-auto p-0 font-semibold transition-all duration-200 hover:scale-105 focus:scale-105 focus:ring-2"
                >
                  Level
                  {getSortIcon('level')}
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { handleSort('power'); }}
                  className="text-muted-foreground hover:text-foreground focus:ring-primary/20 h-auto p-0 font-semibold transition-all duration-200 hover:scale-105 focus:scale-105 focus:ring-2"
                >
                  Power
                  {getSortIcon('power')}
                </Button>
              </TableHead>
              <TableHead className="text-center font-semibold">Accuracy</TableHead>
              <TableHead className="text-center font-semibold">PP</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMoves.map((pokemonMove, index) => (
              <MoveRow key={`${pokemonMove.pokemonId}-${pokemonMove.moveId}`} pokemonMove={pokemonMove} index={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
