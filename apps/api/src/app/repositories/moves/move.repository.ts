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
   * Find all moves a specific Pokémon can learn
   */
  async findByPokemonId(pokemonId: string): Promise<PokemonMoveSelectEntity[]> {
    return this.drizzle.db.query.pokemonMoveEntity.findMany({
      where: eq(pokemonMoveEntity.pokemonId, pokemonId),
      orderBy: [asc(pokemonMoveEntity.level)],
      with: {
        move: { with: { type: true } },
      },
    });
  }

  /**
   * Find a move by its ID (with type info)
   */
  async findById(moveId: string): Promise<MoveSelectEntity | undefined> {
    return this.drizzle.db.query.moveEntity.findFirst({
      where: eq(moveEntity.id, moveId),
      with: { type: true },
    });
  }

  /**
   * Find all moves (with type info)
   */
  async findAll(): Promise<MoveSelectEntity[]> {
    return this.drizzle.db.query.moveEntity.findMany({
      with: { type: true },
      orderBy: [asc(moveEntity.name)],
    });
  }
}
