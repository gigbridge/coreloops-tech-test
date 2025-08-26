import { pokemonAbilityEntity, type AbilitySelectEntity } from '@coreloops-orm/schemas';

export type PokemonAbilitySelectEntityBase = typeof pokemonAbilityEntity.$inferSelect;
export type PokemonAbilitySelectEntity = PokemonAbilitySelectEntityBase & {
  ability: AbilitySelectEntity;
};
