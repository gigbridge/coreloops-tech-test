'use client';

import { useApiQuery } from '@/src/api/hooks/use-api-query';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { ViewPokemonDto } from '@coreloops/shared-types';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface PokemonMove {
  id: string;
  name: string;
  power: number | null;
  accuracy: number | null;
  level: number;
  type: {
    name: string;
    iconUrl: string;
  };
}

interface PokemonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemon: ViewPokemonDto | null;
}

type SortField = 'level' | 'power' | 'name';
type SortDirection = 'asc' | 'desc';

export function PokemonDetailModal({ isOpen, onClose, pokemon }: PokemonDetailModalProps) {
  const [sortField, setSortField] = useState<SortField>('level');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: moves, isLoading: movesLoading } = useApiQuery<PokemonMove[]>(
    ['pokemon', pokemon?.id, 'moves'],
    `/pokemon/${pokemon?.id}/moves`,
    {
      enabled: !!pokemon?.id && isOpen,
    },
  );

  const sortedMoves = useMemo(() => {
    if (!moves) return [];

    return [...moves].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        case 'power':
          aValue = a.power ?? 0;
          bValue = b.power ?? 0;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [moves, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDexNo = (n: number) => `#${n.toString().padStart(4, '0')}`;

  if (!pokemon) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-muted-foreground">{formatDexNo(pokemon.pokedexNumber)}</span>
            <span className="capitalize">{pokemon.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pokemon Details */}
          <div className="flex items-center gap-6">
            <div className="bg-muted/30 flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-lg border">
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`}
                alt={pokemon.name}
                width={120}
                height={120}
              />
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-muted-foreground text-sm font-medium">Types</h3>
                <div className="mt-1 flex gap-2">
                  {pokemon.types.map(type => (
                    <Image key={type.id} src={type.iconUrl} alt={type.name} width={100} height={75} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm font-medium">Abilities</h3>
                <div className="mt-1 space-y-1">
                  {pokemon.abilities.map(ability => (
                    <div key={ability.id} className="text-sm">
                      {ability.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Moves Table */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Moves</h3>
            {movesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold"
                          onClick={() => {
                            handleSort('level');
                          }}
                        >
                          Level
                          {sortField === 'level' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold"
                          onClick={() => {
                            handleSort('name');
                          }}
                        >
                          Move
                          {sortField === 'name' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead className="w-[100px]">
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-semibold"
                          onClick={() => {
                            handleSort('power');
                          }}
                        >
                          Power
                          {sortField === 'power' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[100px]">Accuracy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMoves.map(move => (
                      <TableRow key={move.id}>
                        <TableCell className="font-medium">{move.level}</TableCell>
                        <TableCell className="capitalize">{move.name.replace('-', ' ')}</TableCell>
                        <TableCell>
                          <Image src={move.type.iconUrl} alt={move.type.name} width={24} height={18} />
                        </TableCell>
                        <TableCell>{move.power ?? '—'}</TableCell>
                        <TableCell>{move.accuracy ?? '—'}</TableCell>
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
