import { IsNumber, IsUUID } from 'class-validator';
import { ViewMoveDto } from './move.dto';

// Type definition for PokemonMoveSelectEntity
interface PokemonMoveSelectEntity {
  pokemonId: string;
  moveId: string;
  level: number;
  move?: any;
}

export class PokemonMoveDto {
  @IsUUID()
  pokemonId!: string;

  @IsUUID()
  moveId!: string;

  @IsNumber()
  level!: number;

  move!: ViewMoveDto;

  constructor(entity?: PokemonMoveSelectEntity) {
    if (entity) {
      Object.assign(this, entity);

      if (entity.move) {
        this.move = new ViewMoveDto(entity.move);
      }
    }
  }
}
