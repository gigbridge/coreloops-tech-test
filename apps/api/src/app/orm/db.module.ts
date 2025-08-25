import { Global, Module } from '@nestjs/common';
import { DrizzleProvider } from './db';

@Global()
@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DbModule {}
