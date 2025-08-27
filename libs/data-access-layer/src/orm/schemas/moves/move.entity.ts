import { typeEntity } from '../types/type.entity';
import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const moveEntity = pgTable('moves', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: text('name').notNull(),
  accuracy: integer('accuracy'),
  damageClass: text('damage_class').notNull(),
  power: integer('power'),
  pp: integer('pp'),
  typeId: uuid('type_id')
    .notNull()
    .references(() => typeEntity.id),
});