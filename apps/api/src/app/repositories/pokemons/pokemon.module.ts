import { Module } from '@nestjs/common';
import { PokemonRepository } from 'src/app/repositories/pokemons/pokemon.repository';

@Module({
  exports: [PokemonRepository],
  providers: [PokemonRepository],
})
export class PokemonModule {}
