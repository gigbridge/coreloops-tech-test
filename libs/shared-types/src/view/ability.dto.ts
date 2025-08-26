import { AbilitySelectEntity } from '@coreloops/data-access-layer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ViewAbilityDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string | null;

  constructor(entity?: AbilitySelectEntity) {
    if (entity) Object.assign(this, entity);
  }
}
