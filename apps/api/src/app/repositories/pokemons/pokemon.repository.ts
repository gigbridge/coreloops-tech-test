import { UserStore } from '@coreloops-api/shared/contexts';
import { WithClause } from '@coreloops-api/shared/utils/types';
import { PokemonSelectEntity } from '@coreloops-orm/schemas/pokemons/pokemon.types';
import { BaseRepository } from '@coreloops-repos/base.repository';
import { DrizzleProvider, pokemonEntity, pokemonMoveEntity } from '@coreloops/data-access-layer';
import { CursorQueryDto } from '@coreloops/shared-types';
import { Injectable } from '@nestjs/common';
import { asc, eq, gt } from 'drizzle-orm';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PokemonRepository extends BaseRepository {
  readonly table = pokemonEntity;

  constructor(
    protected readonly drizzle: DrizzleProvider,
    protected readonly cls: ClsService<UserStore>,
  ) {
    super(drizzle, cls);
  }

  private buildWithClause(includeMoves = false): WithClause {
    const withClause: WithClause = {
      abilities: { with: { ability: true } },
      types: { with: { type: true } },
    };

    if (includeMoves) {
      withClause.moves = {
        with: { move: { with: { type: true } } },
        orderBy: (pokemonMoves: typeof pokemonMoveEntity, helpers: { asc: typeof asc }): [ReturnType<typeof asc>] => [
          helpers.asc(pokemonMoves.level),
        ],
      };
    }

    return withClause;
  }

  async findMultiplePokemon({
    afterId,
    limit = 10,
  }: CursorQueryDto & { includeMoves?: boolean }): Promise<{ hasNextPage: boolean; entities: PokemonSelectEntity[] }> {
    const where = afterId ? gt(this.table.pokedexNumber, Number(afterId)) : undefined;

    const rows = await this.drizzle.db.query.pokemonEntity.findMany({
      where,
      orderBy: [asc(this.table.pokedexNumber)],
      limit: limit + 1,
      with: this.buildWithClause(),
    });

    const hasNextPage = rows.length > limit;
    const entities = hasNextPage ? rows.slice(0, limit) : rows;

    return { hasNextPage, entities: entities as PokemonSelectEntity[] };
  }

  async findById(id: string, includeMoves = false): Promise<PokemonSelectEntity | null> {
    return (await this.drizzle.db.query.pokemonEntity.findFirst({
      where: eq(this.table.id, id),
      with: this.buildWithClause(includeMoves),
    })) as PokemonSelectEntity | null;
  }

  async deleteById(id: string): Promise<void> {
    const pokemon = await this.drizzle.db.query.pokemonEntity.findFirst({
      where: eq(this.table.id, id),
    });

    if (!pokemon) {
      throw new Error(`Pokemon with id ${id} not found`);
    }

    await this.drizzle.db.delete(this.table).where(eq(this.table.id, id));
  }
}
