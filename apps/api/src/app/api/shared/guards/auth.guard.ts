import { BaseGuard } from '@coreloops-api/shared/guards/base.guard';
import { UserRepository } from '@coreloops-orm/users/user.repository';
import {
  CanActivate,
  ClassProvider,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { UserStore } from '../contexts';

export const Public = () => SetMetadata('isPublic', true);

type JwtPayload = {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
};

@Injectable()
export class JwtAuthGuard extends BaseGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    protected readonly cls: ClsService<UserStore>,
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly userRepository: UserRepository,
  ) {
    super(cls);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()]);
    if (isPublic) return true;

    const { request } = this.getRequest(context);
    if (!request) throw new UnauthorizedException('Cannot read request context');

    const auth = request.headers?.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    const token = auth.slice('Bearer '.length).trim();

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.userRepository.getUserById(payload.sub);

      this.cls.set('user', user);
      request.user = user;

      return true;
    } catch (err: unknown) {
      const castedError = err as { name: string; message: string };
      if (castedError?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      this.logger.debug(`JWT verify failed: ${castedError?.message ?? err}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

export const JwtAuthGuardProvider: ClassProvider = {
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
};
