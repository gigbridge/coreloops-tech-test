import { PokemonService } from '@coreloops-api/rest/services/pokemon.service';
import { Controller, Get } from '@nestjs/common';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}
  @Get('get')
  public async get() {
    return this.pokemonService.getAllPokemon();
  }
}
