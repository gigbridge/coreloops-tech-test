import { Auth, UserStore } from '@coreloops-api/shared/contexts';
import { UserSelectEntity } from '@coreloops-orm/schemas';
import { UserDto } from '@coreloops/shared-types';
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';

type CoreloopsRequest = Request & { auth?: Auth; user?: UserDto };

@Injectable()
export abstract class BaseGuard implements CanActivate {
  protected constructor(protected readonly cls: ClsService<UserStore>) {}

  public assignUserToRequestAndStore(request: CoreloopsRequest, user?: UserSelectEntity) {
    if (!user) {
      throw new HttpException('Missing user', 400);
    }

    const userDto = new UserDto(user);
    request.user = userDto;
    this.cls.set('user', userDto);
  }

  abstract canActivate(context: ExecutionContext): Promise<boolean>;

  public getRequest(context: ExecutionContext): {
    request: CoreloopsRequest;
    response: Response;
  } {
    const httpCtx = context.switchToHttp();
    return {
      request: httpCtx.getRequest<CoreloopsRequest>(),
      response: httpCtx.getResponse<Response>(),
    };
  }
}
