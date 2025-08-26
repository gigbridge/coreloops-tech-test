import { PokemonService } from '@coreloops-api/rest/services/pokemon.service';
import { CursorQueryDto } from '@coreloops/shared-types';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findMultiplePokemon(@Query() body: CursorQueryDto) {
    return this.pokemonService.findMultiplePokemon(body);
  }
}
