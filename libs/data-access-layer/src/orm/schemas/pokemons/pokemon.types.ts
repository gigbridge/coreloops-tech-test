import { type PokemonAbilitySelectEntity } from '../pokemon-abilities/pokemon-ability.types';
import { type PokemonTypeSelectEntity } from '../pokemon-types/pokemon-types.types';
import { pokemonEntity } from './pokemon.entity';

export type PokemonSelectEntityBase = typeof pokemonEntity.$inferSelect;
export type PokemonSelectEntity = PokemonSelectEntityBase & {
  types: PokemonTypeSelectEntity[];
  abilities: PokemonAbilitySelectEntity[];
};
