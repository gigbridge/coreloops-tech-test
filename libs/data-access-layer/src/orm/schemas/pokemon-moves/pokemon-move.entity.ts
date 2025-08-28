import { moveEntity } from '@coreloops-orm/schemas/moves/move.entity';
import { pokemonEntity } from '@coreloops-orm/schemas/pokemons/pokemon.entity';
import { integer, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const pokemonMoveEntity = pgTable(
  'pokemon_moves',
  {
    pokemonId: uuid('pokemon_id')
      .notNull()
      .references(() => pokemonEntity.id, { onDelete: 'cascade' }),
    moveId: uuid('move_id')
      .notNull()
      .references(() => moveEntity.id),
    level: integer('level').notNull(),
  },
  table => [primaryKey({ columns: [table.pokemonId, table.moveId] })],
);
