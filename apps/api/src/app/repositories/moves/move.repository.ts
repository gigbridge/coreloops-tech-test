import { UserStore } from '@coreloops-api/shared/contexts';
import { MoveSelectEntity } from '@coreloops-orm/schemas/moves/move.types';
import { PokemonMoveSelectEntity } from '@coreloops-orm/schemas/pokemon-moves/pokemon-move.types';
import { BaseRepository } from '@coreloops-repos/base.repository';
import { DrizzleProvider, moveEntity, pokemonMoveEntity } from '@coreloops/data-access-layer';
import { Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class MoveRepository extends BaseRepository {
  readonly table = moveEntity;
  
  constructor(
    protected readonly drizzle: DrizzleProvider,
    protected readonly cls: ClsService<UserStore>,
  ) {
    super(drizzle, cls);
  }

  /**
   * Find all moves that a specific Pokemon can learn
   * @param pokemonId - The UUID of the Pokemon
   * @returns Array of moves with their learning level and type information
   */
  async findMovesByPokemonId(pokemonId: string): Promise<PokemonMoveSelectEntity[]> {
    const rows = await this.drizzle.db.query.pokemonMoveEntity.findMany({
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

    return rows;
  }

  /**
   * Find a move by its ID with type information
   * @param moveId - The UUID of the move
   * @returns Move entity with type information or undefined if not found
   */
  async findMoveById(moveId: string): Promise<MoveSelectEntity | undefined> {
    const move = await this.drizzle.db.query.moveEntity.findFirst({
      where: eq(moveEntity.id, moveId),
      with: {
        type: true,
      },
    });

    return move;
  }

  /**
   * Find all moves with their type information
   * @returns Array of all moves with type information
   */
  async findAllMoves(): Promise<MoveSelectEntity[]> {
    const moves = await this.drizzle.db.query.moveEntity.findMany({
      with: {
        type: true,
      },
      orderBy: [asc(moveEntity.name)],
    });

    return moves;
  }
}