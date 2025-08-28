import { PokemonService } from '@coreloops-api/rest/services/pokemon.service';
import { CursorQueryDto } from '@coreloops/shared-types';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findMultiplePokemon(@Query() body: CursorQueryDto) {
    return this.pokemonService.findMultiplePokemon(body);
  }

  @Get(':id/moves')
  @HttpCode(HttpStatus.OK)
  public async findPokemonMoves(@Param('id') id: string) {
    return this.pokemonService.findPokemonMoves(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deletePokemon(@Param('id') id: string): Promise<void> {
    await this.pokemonService.deletePokemon(id);
  }
}
