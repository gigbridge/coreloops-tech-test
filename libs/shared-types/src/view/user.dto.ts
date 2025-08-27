import { UserSelectEntity } from '@coreloops/data-access-layer';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class ViewUserDto {
  @IsUUID()
  id!: string;

  @IsString()
  username!: string;

  @IsBoolean()
  isAdmin!: boolean;

  constructor(entity?: UserSelectEntity) {
    if (entity) Object.assign(this, entity);
  }
}
