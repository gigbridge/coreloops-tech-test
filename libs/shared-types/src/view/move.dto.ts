import { type MoveSelectEntity } from '@coreloops/data-access-layer';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import { ViewTypeDto } from './type.dto';

export class ViewMoveDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsNumber()
  accuracy!: number | null;

  @IsString()
  damageClass!: string | null;

  @IsNumber()
  power!: number | null;

  @IsNumber()
  pp!: number | null;

  type!: ViewTypeDto;

  constructor(entity?: MoveSelectEntity) {
    if (entity) {
      Object.assign(this, entity);
      if (entity.type) {
        this.type = new ViewTypeDto(entity.type);
      }
    }
  }
}
