import * as abilityEntity from './schemas/abilities/ability.entity';
import * as abilityRelations from './schemas/abilities/ability.relations';
import * as pokemonAbilityEntity from './schemas/pokemon-abilities/pokemon-ability.entity';
import * as pokemonAbilityRelations from './schemas/pokemon-abilities/pokemon-ability.relations';
import * as pokemonTypeEntity from './schemas/pokemon-types/pokemon-type.entity';
import * as pokemonTypeRelations from './schemas/pokemon-types/pokemon-type.relations';
import * as pokemonEntity from './schemas/pokemons/pokemon.entity';
import * as pokemonRelations from './schemas/pokemons/pokemon.relations';
import * as typeEntity from './schemas/types/type.entity';
import * as typeRelations from './schemas/types/type.relations';
import * as userEntity from './schemas/users/user.entity';
import * as userRelations from './schemas/users/user.relations';

export const schema = {
  abilityEntity,
  abilityRelations,
  pokemonAbilityEntity,
  pokemonAbilityRelations,
  pokemonTypeEntity,
  pokemonTypeRelations,
  pokemonEntity,
  pokemonRelations,
  typeEntity,
  typeRelations,
  userEntity,
  userRelations,
};
