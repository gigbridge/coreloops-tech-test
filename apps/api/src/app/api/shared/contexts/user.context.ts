import { IncomingMessage } from 'http';

import { UserDto } from '@coreloops/shared-types';
import { ClsStore } from 'nestjs-cls';

export interface UserStore extends ClsStore {
  user?: UserDto;
}

export class UserContext extends IncomingMessage {
  user?: UserDto;
}
