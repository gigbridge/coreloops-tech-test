import { pokemonEntity, typeEntity } from '@coreloops-orm/schemas';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const pokemonTypeEntity = pgTable(
  'pokemon_types',
  {
    pokemonId: uuid('pokemon_id')
      .notNull()
      .references(() => pokemonEntity.id, { onDelete: 'cascade' }),
    typeId: uuid('type_id')
      .notNull()
      .references(() => typeEntity.id),
  },
  table => [primaryKey({ columns: [table.typeId, table.pokemonId] })],
);
