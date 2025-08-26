import { abilityEntity, pokemonAbilityEntity, pokemonEntity } from '@coreloops-orm/schemas';
import { relations } from 'drizzle-orm';

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
