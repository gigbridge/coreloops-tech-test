import { UserSelectEntity } from '@coreloops/data-access-layer';
import { IsString, IsUUID } from 'class-validator';

export class ViewUserDto {
  @IsUUID()
  id!: string;

  @IsString()
  username!: string;

  constructor(entity?: UserSelectEntity) {
    if (entity) Object.assign(this, entity);
  }
}
