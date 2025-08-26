import { PokemonService } from '@coreloops-api/rest/services/pokemon.service';
import { UserService } from '@coreloops-api/rest/services/user.service';
import { Module } from '@nestjs/common';
import { PokemonModule } from 'src/app/repositories/pokemons/pokemon.module';
import { UserModule } from 'src/app/repositories/users/user.module';

@Module({
  providers: [PokemonService, UserService],
  exports: [PokemonService, UserService],
  imports: [UserModule, PokemonModule],
})
export class RestServicesModule {}
