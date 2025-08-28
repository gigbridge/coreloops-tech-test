import { pokemonMoveEntity } from './pokemon-move.entity';

export type PokemonMoveSelectEntityBase = typeof pokemonMoveEntity.$inferSelect;
export type PokemonMoveSelectEntity = PokemonMoveSelectEntityBase;
