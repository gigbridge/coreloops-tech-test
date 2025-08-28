import { moveEntity } from '@coreloops-orm/schemas/moves/move.entity';
import { pokemonMoveEntity } from '@coreloops-orm/schemas/pokemon-moves/pokemon-move.entity';
import { relations } from 'drizzle-orm';
import { pokemonEntity } from '../pokemons';

export const pokemonMoveRelations = relations(pokemonMoveEntity, ({ one }) => {
  return {
    pokemon: one(pokemonEntity, {
      fields: [pokemonMoveEntity.pokemonId],
      references: [pokemonEntity.id],
      relationName: 'pokemon_moves_pokemon',
    }),
    move: one(moveEntity, {
      fields: [pokemonMoveEntity.moveId],
      references: [moveEntity.id],
      relationName: 'pokemon_moves_move',
    }),
  };
});
