import { moveEntity } from '@coreloops-orm/schemas/moves/move.entity';
import { pokemonTypeEntity } from '@coreloops-orm/schemas/pokemon-types/pokemon-type.entity';
import { typeEntity } from '@coreloops-orm/schemas/types/type.entity';
import { relations } from 'drizzle-orm';

export const typeRelations = relations(typeEntity, ({ many }) => {
  return {
    pokemonTypes: many(pokemonTypeEntity, {
      relationName: 'pokemon_types_type',
    }),
    moves: many(moveEntity, {
      relationName: 'moves_type',
    }),
  };
});
