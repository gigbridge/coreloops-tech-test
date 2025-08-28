import { integer, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const pokemonMoveEntity = pgTable(
  'pokemon_moves',
  {
    pokemonId: uuid('pokemon_id').notNull(),
    moveId: uuid('move_id').notNull(),
    level: integer('level').notNull().default(0),
  },
  table => [primaryKey({ columns: [table.pokemonId, table.moveId] })],
);
