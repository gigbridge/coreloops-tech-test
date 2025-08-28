import { relations } from 'drizzle-orm';
import { moveEntity } from '../moves/move.entity';
import { pokemonEntity } from '../pokemons/pokemon.entity';
import { pokemonMoveEntity } from './pokemon-move.entity';

export const pokemonMoveRelations = relations(pokemonMoveEntity, ({ one }) => {
  return {
    pokemon: one(pokemonEntity, {
      fields: [pokemonMoveEntity.pokemonId],
      references: [pokemonEntity.id],
    }),
    move: one(moveEntity, {
      fields: [pokemonMoveEntity.moveId],
      references: [moveEntity.id],
    }),
  };
});
