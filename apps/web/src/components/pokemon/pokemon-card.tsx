'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@coreloops-ui/card';
import { ViewPokemonDto } from '@coreloops/shared-types';
import { Shield, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface PokemonCardProps {
  pokemon: ViewPokemonDto;
  isAdmin?: boolean;
  isDeleting?: boolean;
  onView: (pokemonId: string) => void;
  onDelete: (pokemonId: string) => void;
}

function formatDexNo(n: number) {
  return `#${String(n).padStart(3, '0')}`;
}

export function PokemonCard({ pokemon, isAdmin = false, onView, onDelete }: PokemonCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleViewClick = () => {
    onView(pokemon.id);
  };

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete(pokemon.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => {
        setShowDeleteConfirm(false);
      }, 3000);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Card className="group relative transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg">
      {isAdmin && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute top-2 right-2 z-10 duration-300">
          <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 shadow-sm transition-all duration-200 hover:bg-blue-200">
            <Shield className="h-3 w-3" />
            Admin
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">{formatDexNo(pokemon.pokedexNumber)}</span>
          <span className="truncate font-semibold">{pokemon.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="bg-muted/30 group-hover:bg-muted/50 flex h-32 w-full items-center justify-center rounded-md border transition-all duration-300">
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`}
              alt={pokemon.name}
              width={100}
              height={100}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {pokemon.types.map((type, index) => (
              <Image
                key={type.id}
                src={type.iconUrl}
                alt={type.name}
                width={80}
                height={60}
                className="transition-all duration-200 hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex w-full flex-row items-center justify-between gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleViewClick}
          className="focus:ring-primary/20 transition-all duration-200 hover:scale-105 focus:scale-105 focus:ring-2"
        >
          View
        </Button>
        {isAdmin && (
          <div className="flex items-center gap-2">
            {showDeleteConfirm ? (
              <div className="animate-in fade-in slide-in-from-right-2 flex items-center gap-2 duration-200">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  className="text-xs transition-all duration-200 hover:scale-105 focus:scale-105"
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelDelete}
                  className="text-xs transition-all duration-200 hover:scale-105 focus:scale-105"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteClick}
                aria-label="Delete pokemon"
                className="hover:bg-destructive/10 focus:ring-destructive/20 transition-all duration-200 hover:scale-110 focus:scale-110 focus:ring-2"
              >
                <Trash className="text-destructive size-4 transition-transform duration-200 group-hover:scale-110" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
