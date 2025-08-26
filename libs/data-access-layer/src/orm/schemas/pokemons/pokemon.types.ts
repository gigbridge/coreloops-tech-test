import { pokemonEntity, type PokemonAbilitySelectEntity, type PokemonTypeSelectEntity } from '@coreloops-orm/schemas';

export type PokemonSelectEntityBase = typeof pokemonEntity.$inferSelect;
export type PokemonSelectEntity = PokemonSelectEntityBase & {
  types: PokemonTypeSelectEntity[];
  abilities: PokemonAbilitySelectEntity[];
};
