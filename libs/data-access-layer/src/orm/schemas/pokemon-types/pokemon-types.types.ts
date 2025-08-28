import { type TypeSelectEntity } from '../types/type.types';
import { pokemonTypeEntity } from './pokemon-type.entity';

export type PokemonTypeSelectEntityBase = typeof pokemonTypeEntity.$inferSelect;
export type PokemonTypeSelectEntity = PokemonTypeSelectEntityBase & {
  type: TypeSelectEntity;
};
