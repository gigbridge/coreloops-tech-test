import { pokemonTypeEntity, type TypeSelectEntity } from '@coreloops-orm/schemas';

export type PokemonTypeSelectEntityBase = typeof pokemonTypeEntity.$inferSelect;
export type PokemonTypeSelectEntity = PokemonTypeSelectEntityBase & {
  type: TypeSelectEntity;
};
