import { TypeSelectEntity } from '@coreloops/data-access-layer';
import { IsString, IsUUID } from 'class-validator';

export class ViewTypeDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  iconUrl!: string;

  constructor(entity?: TypeSelectEntity) {
    if (entity) Object.assign(this, entity);
  }
}
