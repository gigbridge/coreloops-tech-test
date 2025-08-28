import { relations } from 'drizzle-orm';

import { pokemonAbilityEntity } from '../pokemon-abilities/pokemon-ability.entity';
import { abilityEntity } from './ability.entity';

export const abilityRelations = relations(abilityEntity, ({ many }) => {
  return {
    pokemonAbilities: many(pokemonAbilityEntity, {
      relationName: 'pokemon_abilities_ability',
    }),
  };
});
