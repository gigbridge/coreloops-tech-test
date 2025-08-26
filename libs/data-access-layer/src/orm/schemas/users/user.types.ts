import { userEntity } from '@coreloops-orm/schemas/users/user.entity';

export type UserSelectEntity = typeof userEntity.$inferSelect;
