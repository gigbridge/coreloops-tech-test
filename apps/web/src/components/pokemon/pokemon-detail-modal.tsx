'use client';

import { useApiQuery } from '@/src/api/hooks/use-api-query';
import { Button } from '@/src/components/ui/button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/src/components/ui/modal';
import { Card, CardContent, CardHeader, CardTitle } from '@coreloops-ui/card';
import { PokemonMoveDto, ViewPokemonDto } from '@coreloops/shared-types';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type SortKey = 'level' | 'power';
type SortDir = 'asc' | 'desc';

type PokemonDetailModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  pokemonId: string | null;
};

export function PokemonDetailModal({ open, onOpenChange, pokemonId }: PokemonDetailModalProps) {
  const { data, isLoading, isError } = useApiQuery<ViewPokemonDto>(
    ['pokemon', pokemonId],
    `/pokemon/${pokemonId}`,
    undefined,
    { enabled: !!pokemonId && open },
  );

  const [sortKey, setSortKey] = useState<SortKey>('level');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sortedMoves = useMemo(() => {
    const moves = (data?.moves ?? []) as PokemonMoveDto[];
    const modifier = sortDir === 'asc' ? 1 : -1;
    return [...moves].sort((a, b) => {
      const aVal = sortKey === 'level' ? a.level : a.move.power ?? -1;
      const bVal = sortKey === 'level' ? b.level : b.move.power ?? -1;
      return (aVal - bVal) * modifier;
    });
  }, [data?.moves, sortDir, sortKey]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data && (
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.pokedexNumber}.png`}
                alt={data.name}
                width={48}
                height={48}
              />
            )}
            <div>
              <div className="text-lg font-semibold">{data?.name ?? 'Pokémon'}</div>
              <div className="text-muted-foreground text-xs">#{data?.pokedexNumber}</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>
      </ModalHeader>
      <ModalBody>
        {isLoading && <div className="text-sm">Loading…</div>}
        {isError && <div className="text-destructive text-sm">Failed to load details.</div>}
        {data && (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-muted-foreground">Name</div>
                <div className="font-medium">{data.name}</div>
                <div className="text-muted-foreground">Pokédex No.</div>
                <div className="font-medium">{data.pokedexNumber}</div>
                <div className="text-muted-foreground">Types</div>
                <div className="flex flex-wrap gap-2">
                  {data.types.map(t => (
                    <Image key={t.id} src={t.iconUrl} alt={t.name} width={64} height={48} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Moves</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant={sortKey === 'level' ? 'secondary' : 'outline'} size="sm" onClick={() => toggleSort('level')}>
                      Level {sortKey === 'level' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                    </Button>
                    <Button variant={sortKey === 'power' ? 'secondary' : 'outline'} size="sm" onClick={() => toggleSort('power')}>
                      Power {sortKey === 'power' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="py-2 pr-4">Level</th>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Type</th>
                        <th className="py-2 pr-4">Power</th>
                        <th className="py-2 pr-4">Accuracy</th>
                        <th className="py-2 pr-4">Class</th>
                        <th className="py-2 pr-4">PP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedMoves.map(pm => (
                        <tr key={`${pm.pokemonId}-${pm.moveId}`} className="border-t">
                          <td className="py-2 pr-4">{pm.level}</td>
                          <td className="py-2 pr-4">{pm.move.name}</td>
                          <td className="py-2 pr-4">{pm.move.type?.name}</td>
                          <td className="py-2 pr-4">{pm.move.power ?? '-'}</td>
                          <td className="py-2 pr-4">{pm.move.accuracy ?? '-'}</td>
                          <td className="py-2 pr-4 capitalize">{pm.move.damageClass}</td>
                          <td className="py-2 pr-4">{pm.move.pp}</td>
                        </tr>
                      ))}
                      {sortedMoves.length === 0 && (
                        <tr>
                          <td className="py-4 text-center text-muted-foreground" colSpan={7}>
                            No moves found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}


