import { relations } from 'drizzle-orm';
import { pokemonEntity } from '../pokemons/pokemon.entity';
import { typeEntity } from '../types/type.entity';
import { pokemonTypeEntity } from './pokemon-type.entity';

export const pokemonTypeRelations = relations(pokemonTypeEntity, ({ one }) => {
  return {
    pokemon: one(pokemonEntity, {
      fields: [pokemonTypeEntity.pokemonId],
      references: [pokemonEntity.id],
      relationName: 'pokemon_types_pokemon',
    }),
    type: one(typeEntity, {
      fields: [pokemonTypeEntity.typeId],
      references: [typeEntity.id],
      relationName: 'pokemon_types_type',
    }),
  };
});
