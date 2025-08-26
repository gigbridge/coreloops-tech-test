import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const typeEntity = pgTable('types', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: text('name').notNull(),
  iconUrl: text('icon_url').notNull(),
});
