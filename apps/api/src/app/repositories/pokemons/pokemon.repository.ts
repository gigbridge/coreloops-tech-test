import { UserStore } from '@coreloops-api/shared/contexts';
import { BaseRepository } from '@coreloops-repos/base.repository';
import { DrizzleProvider, pokemonEntity } from '@coreloops/data-access-layer';
import { CursorQueryDto } from '@coreloops/shared-types';
import { Injectable } from '@nestjs/common';
import { asc, gt } from 'drizzle-orm';
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

  async findMultiplePokemon({ afterId, limit = 10 }: CursorQueryDto) {
    const pageSize = Math.min(Math.max(limit, 1), 100);

    const count = await this.getCount();

    const where = afterId ? gt(this.table.pokedexNumber, Number(afterId)) : undefined;

    const rows = await this.drizzle.db.query.pokemonEntity.findMany({
      where,
      orderBy: [asc(this.table.pokedexNumber)],
      limit: pageSize + 1,
    });

    const hasNextPage = rows.length > pageSize;
    const nodes = hasNextPage ? rows.slice(0, pageSize) : rows;
    const lastNode = nodes[nodes.length - 1];
    const endCursor = lastNode ? lastNode.id : null;

    const hasPreviousPage = Boolean(afterId);

    return {
      nodes,
      pageInfo: {
        endCursor,
        hasNextPage,
        hasPreviousPage,
        total: count,
      },
    };
  }
}
