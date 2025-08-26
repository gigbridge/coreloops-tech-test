import { UserRepository } from '@coreloops-orm/users/user.repository';
import { Module } from '@nestjs/common';

@Module({
  exports: [UserRepository],
  providers: [UserRepository],
})
export class UserModule {}
