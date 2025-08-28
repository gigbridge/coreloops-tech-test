import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const pokemonEntity = pgTable('pokemons', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: text('name').notNull(),
  pokedexNumber: integer('pokedex_number').notNull(),
});
