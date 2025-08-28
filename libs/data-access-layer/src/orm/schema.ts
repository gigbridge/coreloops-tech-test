import { abilityEntity } from './schemas/abilities/ability.entity';
import * as abilityRelations from './schemas/abilities/ability.relations';
import { moveEntity } from './schemas/moves/move.entity';
import * as moveRelations from './schemas/moves/move.relations';
import { pokemonAbilityEntity } from './schemas/pokemon-abilities/pokemon-ability.entity';
import * as pokemonAbilityRelations from './schemas/pokemon-abilities/pokemon-ability.relations';
import { pokemonMoveEntity } from './schemas/pokemon-moves/pokemon-move.entity';
import * as pokemonMoveRelations from './schemas/pokemon-moves/pokemon-move.relations';
import { pokemonTypeEntity } from './schemas/pokemon-types/pokemon-type.entity';
import * as pokemonTypeRelations from './schemas/pokemon-types/pokemon-type.relations';
import { pokemonEntity } from './schemas/pokemons/pokemon.entity';
import * as pokemonRelations from './schemas/pokemons/pokemon.relations';
import { typeEntity } from './schemas/types/type.entity';
import * as typeRelations from './schemas/types/type.relations';
import { userEntity } from './schemas/users/user.entity';
import * as userRelations from './schemas/users/user.relations';

export const entitySchema = {
  abilityEntity,
  moveEntity,
  pokemonAbilityEntity,
  pokemonMoveEntity,
  pokemonTypeEntity,
  pokemonEntity,
  typeEntity,
  userEntity,
};

export const relationSchema = {
  ...abilityRelations,
  ...moveRelations,
  ...pokemonAbilityRelations,
  ...pokemonMoveRelations,
  ...pokemonTypeRelations,
  ...pokemonRelations,
  ...typeRelations,
  ...userRelations,
};

export const schema = {
  ...entitySchema,
  ...relationSchema,
} as const;
