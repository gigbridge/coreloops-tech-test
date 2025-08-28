'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@coreloops-ui/card';
import { ViewPokemonDto } from '@coreloops/shared-types';
import { Trash } from 'lucide-react';
import Image from 'next/image';

type PokemonCardProps = {
  pokemon: ViewPokemonDto;
  onView?: (pokemon: ViewPokemonDto) => void;
  onDelete?: (pokemon: ViewPokemonDto) => void;
  canDelete?: boolean;
};

function formatDexNo(num: number) {
  return `#${String(num).padStart(3, '0')}`;
}

export function PokemonCard({ pokemon, onView, onDelete, canDelete = false }: PokemonCardProps) {
  return (
    <Card className="group transition">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">{formatDexNo(pokemon.pokedexNumber)}</span>
          <span className="truncate font-semibold">{pokemon.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="bg-muted/30 flex h-32 w-full items-center justify-center rounded-md border">
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`}
              alt={pokemon.name}
              width={100}
              height={100}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {pokemon.types.map(t => (
              <Image key={t.id} src={t.iconUrl} alt={t.name} width={100} height={75} />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex w-full flex-row items-center justify-between gap-2">
        <Button size="sm" variant="secondary" onClick={() => onView?.(pokemon)}>
          View
        </Button>
        {canDelete && (
          <Button variant="ghost" size="icon" onClick={() => onDelete?.(pokemon)}>
            <Trash className="text-destructive size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
