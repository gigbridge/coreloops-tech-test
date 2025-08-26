import { Module } from '@nestjs/common';
import { UserRepository } from 'src/app/repositories/users/user.repository';

@Module({
  exports: [UserRepository],
  providers: [UserRepository],
})
export class UserModule {}
