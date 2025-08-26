import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const userEntity = pgTable('poke_users', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  username: text('username').notNull(),
  password: text('<PASSWORD>').notNull(),
});
