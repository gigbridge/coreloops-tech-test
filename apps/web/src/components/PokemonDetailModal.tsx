'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { apiFetch } from '../api/api-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { SortButton } from './ui/sort-button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

import type { ViewMoveDto, ViewPokemonDto } from '@coreloops/shared-types';

interface PokemonDetailModalProps {
  pokemon: ViewPokemonDto;
  isOpen: boolean;
  onClose: () => void;
}

type SortField = 'name' | 'level' | 'power' | 'accuracy';
type SortDirection = 'asc' | 'desc';

interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

interface PokemonMove extends ViewMoveDto {
  level: number;
}

function PokemonDetailModal({ pokemon, isOpen, onClose }: PokemonDetailModalProps) {
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: 'asc',
  });

  const { data: pokemonMoves, isLoading } = useQuery({
    queryKey: ['pokemon-moves', pokemon.id],
    queryFn: ({ signal }) =>
      apiFetch<{ data: PokemonMove[] }>(`/pokemon/${pokemon.id}/moves`, { method: 'GET', signal }),
    enabled: isOpen,
  });

  const handleSort = (field: SortField) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedMoves = React.useMemo(() => {
    if (!pokemonMoves?.data || !sortState.field) {
      return pokemonMoves?.data || [];
    }

    return [...pokemonMoves.data].sort((a, b) => {
      const aValue = a[sortState.field as keyof PokemonMove];
      const bValue = b[sortState.field as keyof PokemonMove];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return sortState.direction === 'desc' ? -comparison : comparison;
    });
  }, [pokemonMoves?.data, sortState]);

  const getSortDirection = (field: SortField) => {
    if (sortState.field !== field) return null;
    return sortState.direction;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <span className="text-2xl capitalize">{pokemon.name}</span>
            <div className="flex gap-2">
              {pokemon.types.map(type => (
                <span key={type.id} className="rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
                  {type.name}
                </span>
              ))}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="mb-3 text-lg font-semibold">Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Pokédex Number:</span> #{pokemon.pokedexNumber}
              </div>
            </div>

            {pokemon.abilities && pokemon.abilities.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 font-medium">Abilities</h4>
                <div className="space-y-1">
                  {pokemon.abilities.map(ability => (
                    <div key={ability.id} className="text-sm">
                      {ability.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-lg font-semibold">Moves ({sortedMoves.length})</h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading moves...</div>
              </div>
            ) : (
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <SortButton
                          onClick={() => {
                            handleSort('name');
                          }}
                          sortDirection={getSortDirection('name')}
                        >
                          Name
                        </SortButton>
                      </TableHead>
                      <TableHead>
                        <SortButton
                          onClick={() => {
                            handleSort('level');
                          }}
                          sortDirection={getSortDirection('level')}
                        >
                          Level
                        </SortButton>
                      </TableHead>
                      <TableHead>
                        <SortButton
                          onClick={() => {
                            handleSort('power');
                          }}
                          sortDirection={getSortDirection('power')}
                        >
                          Power
                        </SortButton>
                      </TableHead>
                      <TableHead>
                        <SortButton
                          onClick={() => {
                            handleSort('accuracy');
                          }}
                          sortDirection={getSortDirection('accuracy')}
                        >
                          Accuracy
                        </SortButton>
                      </TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMoves.map(move => (
                      <TableRow key={`${move.id}-${move.level}`}>
                        <TableCell className="font-medium">{move.name}</TableCell>
                        <TableCell>{move.level}</TableCell>
                        <TableCell>{move.power || '—'}</TableCell>
                        <TableCell>{move.accuracy || '—'}</TableCell>
                        <TableCell>
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs">{move.type?.name || 'Unknown'}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PokemonDetailModal;
