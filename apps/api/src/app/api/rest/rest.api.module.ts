import { Module } from '@nestjs/common';

import { ControllersModule } from '@coreloops-api/rest/controllers/controllers.module';
import { RestServicesModule } from '@coreloops-api/rest/services/services.module';
import { HealthModule } from './health';

@Module({
  imports: [HealthModule, RestServicesModule, ControllersModule],
})
export class RestApiModule {}
