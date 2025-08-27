'use client';

import { PokemonMoveDto, ViewMoveDto, ViewTypeDto } from '@coreloops/shared-types';
import { MovesTable } from './moves-table';

// Demo component to verify the MovesTable works
export function MovesTableDemo() {
  const mockType: ViewTypeDto = {
    id: 'type-1',
    name: 'fire',
    iconUrl: 'https://example.com/fire.png',
  };

  const mockMove1: ViewMoveDto = {
    id: 'move-1',
    name: 'Ember',
    accuracy: 100,
    damageClass: 'special',
    power: 40,
    pp: 25,
    typeId: 'type-1',
    type: mockType,
  };

  const mockMove2: ViewMoveDto = {
    id: 'move-2',
    name: 'Flamethrower',
    accuracy: 100,
    damageClass: 'special',
    power: 90,
    pp: 15,
    typeId: 'type-1',
    type: mockType,
  };

  const mockPokemonMoves: PokemonMoveDto[] = [
    {
      pokemonId: 'pokemon-1',
      moveId: 'move-1',
      level: 7,
      move: mockMove1,
    },
    {
      pokemonId: 'pokemon-1',
      moveId: 'move-2',
      level: 15,
      move: mockMove2,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Moves Table Demo</h2>
      <MovesTable moves={mockPokemonMoves} />
    </div>
  );
}
