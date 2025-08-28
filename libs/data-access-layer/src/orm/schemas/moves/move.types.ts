import { moveEntity } from '@coreloops-orm/schemas/moves/move.entity';
import { type TypeSelectEntity } from '@coreloops-orm/schemas/types/type.types';

export type MoveSelectEntityBase = typeof moveEntity.$inferSelect;
export type MoveSelectEntity = MoveSelectEntityBase & {
  type: TypeSelectEntity;
};