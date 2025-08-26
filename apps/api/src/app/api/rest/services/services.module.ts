import { PokemonService } from '@coreloops-api/rest/services/pokemon.service';
import { UserService } from '@coreloops-api/rest/services/user.service';
import { PokemonModule } from '@coreloops-orm/pokemons/pokemon.module';
import { UserModule } from '@coreloops-orm/users/user.module';
import { Module } from '@nestjs/common';

@Module({
  providers: [PokemonService, UserService],
  exports: [PokemonService, UserService],
  imports: [UserModule, PokemonModule],
})
export class RestServicesModule {}
