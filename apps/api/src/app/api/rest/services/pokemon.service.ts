import { PokemonRepository } from '@coreloops-orm/pokemons/pokemon.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepo: PokemonRepository) {}

  async getAllPokemon() {
    return this.pokemonRepo.getAllPokemon();
  }
}
