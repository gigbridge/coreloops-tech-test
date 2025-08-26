import { PokemonRepository } from '@coreloops-repos/pokemons/pokemon.repository';
import { CursorQueryDto } from '@coreloops/shared-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepo: PokemonRepository) {}

  async findMultiplePokemon(queryArgs: CursorQueryDto) {
    return this.pokemonRepo.findMultiplePokemon(queryArgs);
  }
}
