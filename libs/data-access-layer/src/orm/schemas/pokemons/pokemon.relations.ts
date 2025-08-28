import { relations } from 'drizzle-orm';
import { pokemonAbilityEntity } from '../pokemon-abilities/pokemon-ability.entity';
import { pokemonTypeEntity } from '../pokemon-types/pokemon-type.entity';
import { pokemonEntity } from './pokemon.entity';

export const pokemonRelations = relations(pokemonEntity, ({ many }) => {
  return {
    types: many(pokemonTypeEntity, {
      relationName: 'pokemon_types_pokemon',
    }),
    abilities: many(pokemonAbilityEntity, {
      relationName: 'pokemon_abilities_pokemon',
    }),
  };
});
