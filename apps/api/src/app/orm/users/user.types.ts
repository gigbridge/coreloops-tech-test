import { userEntity } from '@coreloops-orm/users/user.entity';

export type UserSelectEntity = typeof userEntity.$inferSelect;
