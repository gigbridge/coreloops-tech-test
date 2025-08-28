import { PokemonService } from '@coreloops-api/rest/services/pokemon.service';
import { AdminGuard, IsAdmin } from '@coreloops-api/shared/guards/admin.guard';
import { CursorQueryDto } from '@coreloops/shared-types';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('pokemon')
export class PokemonController {
  private readonly logger = new Logger(PokemonController.name);

  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findMultiplePokemon(@Query() body: CursorQueryDto) {
    return this.pokemonService.findMultiplePokemon(body);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findPokemonById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.pokemonService.findPokemonWithMoves(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @IsAdmin()
  public async deletePokemon(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.pokemonService.deletePokemon(id);
  }
}
