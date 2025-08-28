import { type TypeSelectEntity } from '../types/type.types';
import { moveEntity } from './move.entity';

export type MoveSelectEntityBase = typeof moveEntity.$inferSelect;
export type MoveSelectEntity = MoveSelectEntityBase & {
  type: TypeSelectEntity;
};
