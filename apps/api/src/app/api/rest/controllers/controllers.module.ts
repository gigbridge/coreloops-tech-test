import { AuthController } from '@coreloops-api/rest/controllers/auth/auth.controller';
import { PokemonController } from '@coreloops-api/rest/controllers/pokemon/pokemon.controller';
import { RestServicesModule } from '@coreloops-api/rest/services/services.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PokemonController, AuthController],
  imports: [RestServicesModule, JwtModule],
})
export class ControllersModule {}
