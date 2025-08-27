import { UserStore } from '@coreloops-api/shared/contexts';
import { PokemonSelectEntity } from '@coreloops-orm/schemas/pokemons/pokemon.types';
import { BaseRepository } from '@coreloops-repos/base.repository';
import { DrizzleProvider, pokemonEntity } from '@coreloops/data-access-layer';
import { CursorQueryDto } from '@coreloops/shared-types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findMultiplePokemon({
    afterId,
    limit = 10,
    includeMoves = false,
  }: CursorQueryDto & { includeMoves?: boolean }): Promise<{ hasNextPage: boolean; entities: PokemonSelectEntity[] }> {
    const where = afterId ? gt(this.table.pokedexNumber, Number(afterId)) : undefined;

    const withClause: any = {
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
    };

    if (includeMoves) {
      withClause.moves = {
        with: {
          move: {
            with: {
              type: true,
            },
          },
        },
        orderBy: (pokemonMoves: any, { asc }: any) => [asc(pokemonMoves.level)],
      };
    }

    const rows = await this.drizzle.db.query.pokemonEntity.findMany({
      where,
      orderBy: [asc(this.table.pokedexNumber)],
      limit: limit + 1,
      with: withClause,
    });

    const hasNextPage = rows.length > limit;
    const entities = (hasNextPage ? rows.slice(0, limit) : rows) as PokemonSelectEntity[];

    return {
      hasNextPage,
      entities,
    };
  }

  async findPokemonById(id: string, includeMoves = false): Promise<PokemonSelectEntity | null> {
    const withClause: any = {
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
    };

    if (includeMoves) {
      withClause.moves = {
        with: {
          move: {
            with: {
              type: true,
            },
          },
        },
        orderBy: (pokemonMoves: any, { asc }: any) => [asc(pokemonMoves.level)],
      };
    }

    const pokemon = await this.drizzle.db.query.pokemonEntity.findFirst({
      where: eq(this.table.id, id),
      with: withClause,
    });

    return (pokemon as PokemonSelectEntity) || null;
  }

  async deletePokemon(id: string): Promise<void> {
    // Check if user is admin (isAdmin field will be added in task 8)
    const user = this.currentUser;
    const userWithAdmin = user as any;
    const isAdmin = userWithAdmin?.isAdmin || false;

    if (!isAdmin) {
      throw new ForbiddenException('Only admin users can delete Pokemon');
    }

    // Check if pokemon exists
    const pokemon = await this.drizzle.db.query.pokemonEntity.findFirst({
      where: eq(this.table.id, id),
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }

    try {
      // Delete the pokemon (cascade will handle related records)
      await this.drizzle.db.delete(this.table).where(eq(this.table.id, id));

      this.logger.log(`Pokemon ${pokemon.name} (${id}) deleted by admin user ${user.id}`);
    } catch (error) {
      this.logger.error(`Failed to delete pokemon ${id}:`, error);
      throw new Error('Failed to delete Pokemon');
    }
  }
}
