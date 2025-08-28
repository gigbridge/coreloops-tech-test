import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq, gt } from 'drizzle-orm';
import { ClsService } from 'nestjs-cls';

import { UserStore } from '@coreloops-api/shared/contexts';
import { PokemonSelectEntity } from '@coreloops-orm/schemas/pokemons/pokemon.types';
import { BaseRepository } from '@coreloops-repos/base.repository';
import { DrizzleProvider, pokemonEntity, pokemonMoveEntity } from '@coreloops/data-access-layer';
import { CursorQueryDto } from '@coreloops/shared-types';

@Injectable()
export class PokemonRepository extends BaseRepository {
  readonly table = pokemonEntity;
  constructor(
    protected readonly drizzle: DrizzleProvider,
    protected readonly cls: ClsService<UserStore>,
  ) {
    super(drizzle, cls);
  }

  async findMultiplePokemon({
    afterId,
    limit = 10,
  }: CursorQueryDto): Promise<{ hasNextPage: boolean; entities: PokemonSelectEntity[] }> {
    const where = afterId ? gt(this.table.pokedexNumber, Number(afterId)) : undefined;

    const rows = await this.drizzle.db.query.pokemonEntity.findMany({
      where,
      orderBy: [asc(this.table.pokedexNumber)],
      limit: limit + 1,
      with: {
        abilities: {
          with: {
            ability: true,
          },
        },
        types: {
          with: {
            type: true,
          },
        },
      },
    });

    const hasNextPage = rows.length > limit;
    const entities = hasNextPage ? rows.slice(0, limit) : rows;

    return {
      hasNextPage,
      entities,
    };
  }

  async findPokemonMoves(pokemonId: string) {
    const moves = await this.drizzle.db.query.pokemonMoveEntity.findMany({
      where: eq(pokemonMoveEntity.pokemonId, pokemonId),
      orderBy: [asc(pokemonMoveEntity.level)],
      with: {
        move: {
          with: {
            type: true,
          },
        },
      },
    });

    return moves.map(pm => ({
      ...pm.move,
      level: pm.level,
    }));
  }

  async deletePokemon(pokemonId: string): Promise<void> {
    // Check if user is admin
    const currentUser = this.currentUser;
    if (!currentUser.isAdmin) {
      throw new ForbiddenException('Only admin users can delete Pokemon');
    }

    // Check if Pokemon exists
    const pokemon = await this.drizzle.db.query.pokemonEntity.findFirst({
      where: eq(pokemonEntity.id, pokemonId),
    });

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }

    // Delete Pokemon (this will cascade delete related records due to foreign key constraints)
    await this.drizzle.db.delete(pokemonEntity).where(eq(pokemonEntity.id, pokemonId));
  }
}
