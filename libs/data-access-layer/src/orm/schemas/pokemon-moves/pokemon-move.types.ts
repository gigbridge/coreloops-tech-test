import { type MoveSelectEntity } from '@coreloops-orm/schemas/moves/move.types';
import { pokemonMoveEntity } from '@coreloops-orm/schemas/pokemon-moves/pokemon-move.entity';

export type PokemonMoveSelectEntityBase = typeof pokemonMoveEntity.$inferSelect;
export type PokemonMoveSelectEntity = PokemonMoveSelectEntityBase & {
  move: MoveSelectEntity;
};
