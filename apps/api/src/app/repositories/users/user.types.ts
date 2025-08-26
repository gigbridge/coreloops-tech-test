import { userEntity } from '@coreloops-orm/schemas';

export type UserSelectEntity = typeof userEntity.$inferSelect;
