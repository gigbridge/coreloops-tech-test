import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { pokemonEntity } from '../pokemons/pokemon.entity';
import { typeEntity } from '../types/type.entity';

export const pokemonTypeEntity = pgTable(
  'pokemon_types',
  {
    pokemonId: uuid('pokemon_id')
      .notNull()
      .references(() => pokemonEntity.id),
    typeId: uuid('type_id')
      .notNull()
      .references(() => typeEntity.id),
  },
  table => [primaryKey({ columns: [table.typeId, table.pokemonId] })],
);
