import { relations } from 'drizzle-orm';
import { typeEntity } from '../types/type.entity';
import { moveEntity } from './move.entity';

export const moveRelations = relations(moveEntity, ({ one }) => {
  return {
    type: one(typeEntity, {
      fields: [moveEntity.typeId],
      references: [typeEntity.id],
    }),
  };
});
