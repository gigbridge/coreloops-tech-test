import { PokemonRepository } from '@coreloops-repos/pokemons/pokemon.repository';
import { Connection, CursorQueryDto, ViewMoveDto, ViewPokemonDto } from '@coreloops/shared-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonService {
  constructor(private readonly pokemonRepo: PokemonRepository) {}

  async findMultiplePokemon({ afterId, limit = 10 }: CursorQueryDto): Promise<Connection<ViewPokemonDto>> {
    const pageSize = Math.min(Math.max(limit, 1), 100);
    const nodesPromise = this.pokemonRepo.findMultiplePokemon({ afterId, limit: pageSize });
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

  async findPokemonMoves(pokemonId: string) {
    const moves = await this.pokemonRepo.findPokemonMoves(pokemonId);
    return {
      data: moves.map(move => new ViewMoveDto(move)),
    };
  }

  async deletePokemon(pokemonId: string): Promise<void> {
    await this.pokemonRepo.deletePokemon(pokemonId);
  }
}
