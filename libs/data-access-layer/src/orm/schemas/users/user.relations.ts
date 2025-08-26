import { userEntity } from '@coreloops-orm/schemas/users/user.entity';
import { relations } from 'drizzle-orm';

export const userRelations = relations(userEntity, () => {
  return {};
});
