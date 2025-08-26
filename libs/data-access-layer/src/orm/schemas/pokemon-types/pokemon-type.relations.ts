import { pokemonEntity, pokemonTypeEntity, typeEntity } from '@coreloops-orm/schemas';
import { relations } from 'drizzle-orm';

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
