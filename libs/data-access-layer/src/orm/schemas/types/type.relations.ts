import { relations } from 'drizzle-orm';
import { pokemonTypeEntity } from '../pokemon-types/pokemon-type.entity';
import { typeEntity } from './type.entity';

export const typeRelations = relations(typeEntity, ({ many }) => {
  return {
    pokemonTypes: many(pokemonTypeEntity, {
      relationName: 'pokemon_types_type',
    }),
  };
});
