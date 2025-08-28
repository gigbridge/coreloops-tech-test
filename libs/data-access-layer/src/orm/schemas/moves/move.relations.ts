import { moveEntity } from '@coreloops-orm/schemas/moves/move.entity';
import { pokemonMoveEntity } from '@coreloops-orm/schemas/pokemon-moves/pokemon-move.entity';
import { typeEntity } from '@coreloops-orm/schemas/types/type.entity';
import { relations } from 'drizzle-orm';

export const moveRelations = relations(moveEntity, ({ one, many }) => {
  return {
    type: one(typeEntity, {
      fields: [moveEntity.typeId],
      references: [typeEntity.id],
      relationName: 'moves_type',
    }),
    pokemonMoves: many(pokemonMoveEntity, {
      relationName: 'pokemon_moves_move',
    }),
  };
});
