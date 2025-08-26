import { IncomingMessage } from 'http';

import { ViewUserDto } from '@coreloops/shared-types';
import { ClsStore } from 'nestjs-cls';

export interface UserStore extends ClsStore {
  user?: ViewUserDto;
}

export class UserContext extends IncomingMessage {
  user?: ViewUserDto;
}
