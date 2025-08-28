import { pokemonEntity, type PokemonAbilitySelectEntity, type PokemonTypeSelectEntity, type PokemonMoveSelectEntity } from '@coreloops-orm/schemas';

export type PokemonSelectEntityBase = typeof pokemonEntity.$inferSelect;
export type PokemonSelectEntity = PokemonSelectEntityBase & {
  types: PokemonTypeSelectEntity[];
  abilities: PokemonAbilitySelectEntity[];
  moves?: PokemonMoveSelectEntity[];
};

export type PokemonWithMovesSelectEntity = PokemonSelectEntityBase & {
  types: PokemonTypeSelectEntity[];
  abilities: PokemonAbilitySelectEntity[];
  moves: PokemonMoveSelectEntity[];
};
