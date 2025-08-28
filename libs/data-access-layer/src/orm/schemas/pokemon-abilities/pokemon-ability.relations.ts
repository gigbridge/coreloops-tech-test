import { relations } from 'drizzle-orm';

import { abilityEntity } from '../abilities/ability.entity';
import { pokemonEntity } from '../pokemons/pokemon.entity';
import { pokemonAbilityEntity } from './pokemon-ability.entity';

export const pokemonAbilityRelations = relations(pokemonAbilityEntity, ({ one }) => {
  return {
    pokemon: one(pokemonEntity, {
      fields: [pokemonAbilityEntity.pokemonId],
      references: [pokemonEntity.id],
      relationName: 'pokemon_abilities_pokemon',
    }),
    ability: one(abilityEntity, {
      fields: [pokemonAbilityEntity.abilityId],
      references: [abilityEntity.id],
      relationName: 'pokemon_abilities_ability',
    }),
  };
});
