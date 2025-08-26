import { pokemonAbilityEntity, pokemonEntity, pokemonTypeEntity } from '@coreloops-orm/schemas';
import { relations } from 'drizzle-orm';

export const pokemonRelations = relations(pokemonEntity, ({ one, many }) => {
  return {
    types: many(pokemonTypeEntity, {
      relationName: 'pokemon_types_pokemon',
    }),
    abilities: many(pokemonAbilityEntity, {
      relationName: 'pokemon_abilities_pokemon',
    }),
  };
});
