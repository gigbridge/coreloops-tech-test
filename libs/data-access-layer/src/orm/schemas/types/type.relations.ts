import { pokemonTypeEntity, typeEntity } from '@coreloops-orm/schemas';
import { relations } from 'drizzle-orm';

export const typeRelations = relations(typeEntity, ({ many }) => {
  return {
    pokemonTypes: many(pokemonTypeEntity, {
      relationName: 'pokemon_types_type',
    }),
  };
});
