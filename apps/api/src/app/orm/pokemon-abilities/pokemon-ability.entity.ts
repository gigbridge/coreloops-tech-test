import { abilityEntity } from '@coreloops-orm/abilities/ability.entity';
import { pokemonEntity } from '@coreloops-orm/pokemons/pokemon.entity';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const pokemonAbilityEntity = pgTable(
  'pokemon_abilities',
  {
    pokemonId: uuid('pokemon_id')
      .notNull()
      .references(() => pokemonEntity.id),
    abilityId: uuid('ability_id')
      .notNull()
      .references(() => abilityEntity.id),
  },
  table => [primaryKey({ columns: [table.abilityId, table.pokemonId] })],
);
