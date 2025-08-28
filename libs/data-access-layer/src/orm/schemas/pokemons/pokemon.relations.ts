import { pokemonAbilityEntity } from '@coreloops-orm/schemas/pokemon-abilities/pokemon-ability.entity';
import { pokemonEntity } from '@coreloops-orm/schemas/pokemons/pokemon.entity';
import { pokemonMoveEntity } from '@coreloops-orm/schemas/pokemon-moves/pokemon-move.entity';
import { pokemonTypeEntity } from '@coreloops-orm/schemas/pokemon-types/pokemon-type.entity';
import { relations } from 'drizzle-orm';

export const pokemonRelations = relations(pokemonEntity, ({ many }) => {
  return {
    types: many(pokemonTypeEntity, {
      relationName: 'pokemon_types_pokemon',
    }),
    abilities: many(pokemonAbilityEntity, {
      relationName: 'pokemon_abilities_pokemon',
    }),
    moves: many(pokemonMoveEntity, {
      relationName: 'pokemon_moves_pokemon',
    }),
  };
});
