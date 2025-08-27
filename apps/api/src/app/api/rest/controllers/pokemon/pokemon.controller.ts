import { PokemonService } from '@coreloops-api/rest/services/pokemon.service';
import { RequireAdmin } from '@coreloops-api/shared/guards/admin.guard';
import { CursorQueryDto } from '@coreloops/shared-types';
import { 
  Controller, 
  Get, 
  Delete,
  HttpCode, 
  HttpStatus, 
  Query, 
  Param,
  ParseUUIDPipe,
  UseGuards,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { AdminGuard } from '@coreloops-api/shared/guards/admin.guard';

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
    try {
      return await this.pokemonService.findPokemonWithMoves(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch pokemon with id ${id}:`, error);
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @RequireAdmin()
  public async deletePokemon(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      await this.pokemonService.deletePokemon(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete pokemon with id ${id}:`, error);
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
  }
}
