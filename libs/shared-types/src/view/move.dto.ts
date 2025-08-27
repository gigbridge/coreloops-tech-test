import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ViewTypeDto } from './type.dto';

// Type definition for MoveSelectEntity
interface MoveSelectEntity {
  id: string;
  name: string;
  accuracy: number | null;
  damageClass: string;
  power: number | null;
  pp: number;
  typeId: string;
  type?: any;
}

export class ViewMoveDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  accuracy!: number | null;

  @IsString()
  damageClass!: string;

  @IsOptional()
  @IsNumber()
  power!: number | null;

  @IsNumber()
  pp!: number;

  @IsUUID()
  typeId!: string;

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