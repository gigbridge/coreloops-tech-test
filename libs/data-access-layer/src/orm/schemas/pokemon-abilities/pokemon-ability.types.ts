import { type AbilitySelectEntity } from '../abilities/ability.types';
import { pokemonAbilityEntity } from './pokemon-ability.entity';

export type PokemonAbilitySelectEntityBase = typeof pokemonAbilityEntity.$inferSelect;
export type PokemonAbilitySelectEntity = PokemonAbilitySelectEntityBase & {
  ability: AbilitySelectEntity;
};
