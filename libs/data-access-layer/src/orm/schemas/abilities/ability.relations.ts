import { abilityEntity, pokemonAbilityEntity } from '@coreloops-orm/schemas';
import { relations } from 'drizzle-orm';

export const abilityRelations = relations(abilityEntity, ({ many }) => {
  return {
    pokemonAbilities: many(pokemonAbilityEntity, {
      relationName: 'pokemon_abilities_ability',
    }),
  };
});
