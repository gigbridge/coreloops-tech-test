import { PokemonRepository } from '@coreloops-repos/pokemons/pokemon.repository';
import { Connection, CursorQueryDto, ViewPokemonDto } from '@coreloops/shared-types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(private readonly pokemonRepo: PokemonRepository) {}

  async findMultiplePokemon({
    afterId,
    limit = 10,
    includeMoves = false,
  }: CursorQueryDto & { includeMoves?: boolean }): Promise<Connection<ViewPokemonDto>> {
    const pageSize = Math.min(Math.max(limit, 1), 100);
    const nodesPromise = this.pokemonRepo.findMultiplePokemon({
      afterId,
      limit: pageSize,
      includeMoves,
    });
    const countPromise = this.pokemonRepo.getCount();

    const [{ entities, hasNextPage }, count] = await Promise.all([nodesPromise, countPromise]);

    const lastNode = entities[entities.length - 1];
    const endCursor = lastNode ? lastNode.pokedexNumber : null;
    const hasPreviousPage = Boolean(afterId);

    return {
      nodes: entities.map(node => new ViewPokemonDto(node)),
      pageInfo: {
        endCursor: String(endCursor),
        hasNextPage,
        hasPreviousPage,
        total: count,
      },
    };
  }

  async findPokemonWithMoves(id: string): Promise<ViewPokemonDto> {
    try {
      const pokemon = await this.pokemonRepo.findById(id, true);

      if (!pokemon) {
        throw new NotFoundException(`Pokemon with id ${id} not found`);
      }

      return new ViewPokemonDto(pokemon);
    } catch (error) {
      this.logger.error(`Failed to fetch pokemon with id ${id}:`, error);
      throw error;
    }
  }

  async deletePokemon(id: string): Promise<void> {
    try {
      await this.pokemonRepo.deleteById(id);
      this.logger.log(`Pokemon with id ${id} successfully deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete pokemon with id ${id}:`, error);
      throw error;
    }
  }
}
