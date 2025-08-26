import { JwtAuthGuardProvider } from '@coreloops-api/shared/guards';
import { UserModule } from '@coreloops-repos/users/user.module';
import { DbModule } from '@coreloops/data-access-layer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from './api/api.module';
import { HttpExceptionFilterProvider } from './shared/filters';

@Module({
  imports: [DbModule, ApiModule, ScheduleModule.forRoot(), JwtModule, UserModule],
  providers: [HttpExceptionFilterProvider, JwtAuthGuardProvider],
})
export class AppModule {}
