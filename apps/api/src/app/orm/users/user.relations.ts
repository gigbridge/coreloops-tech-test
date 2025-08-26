import { userEntity } from '@coreloops-orm/users/user.entity';
import { relations } from 'drizzle-orm';

export const userRelations = relations(userEntity, () => {
  return {};
});
