import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const abilityEntity = pgTable('abilities', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});
