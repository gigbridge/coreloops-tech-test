import { abilityEntity } from '@coreloops-orm/schemas/abilities/ability.entity';
import * as abilityRelations from '@coreloops-orm/schemas/abilities/ability.relations';
import { pokemonAbilityEntity } from '@coreloops-orm/schemas/pokemon-abilities/pokemon-ability.entity';
import * as pokemonAbilityRelations from '@coreloops-orm/schemas/pokemon-abilities/pokemon-ability.relations';
import { pokemonTypeEntity } from '@coreloops-orm/schemas/pokemon-types/pokemon-type.entity';
import * as pokemonTypeRelations from '@coreloops-orm/schemas/pokemon-types/pokemon-type.relations';
import { pokemonEntity } from '@coreloops-orm/schemas/pokemons/pokemon.entity';
import * as pokemonRelations from '@coreloops-orm/schemas/pokemons/pokemon.relations';
import { typeEntity } from '@coreloops-orm/schemas/types/type.entity';
import * as typeRelations from '@coreloops-orm/schemas/types/type.relations';
import { userEntity } from '@coreloops-orm/schemas/users/user.entity';
import * as userRelations from '@coreloops-orm/schemas/users/user.relations';

export const entitySchema = {
  abilityEntity,
  pokemonAbilityEntity,
  pokemonTypeEntity,
  pokemonEntity,
  typeEntity,
  userEntity,
};

export const relationSchema = {
  ...abilityRelations,
  ...pokemonAbilityRelations,
  ...pokemonTypeRelations,
  ...pokemonRelations,
  ...typeRelations,
  ...userRelations,
};

export const schema = {
  ...entitySchema,
  ...relationSchema,
} as const;
