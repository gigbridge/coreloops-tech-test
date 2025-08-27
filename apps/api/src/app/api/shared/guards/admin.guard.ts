import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { UserStore } from '../contexts';

export const RequireAdmin = () => SetMetadata('requireAdmin', true);

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<UserStore>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requireAdmin = this.reflector.getAllAndOverride<boolean>('requireAdmin', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireAdmin) {
      return true;
    }

    const user = this.cls.get('user');
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if the user has admin privileges using the isAdmin field
    const isAdmin = user.isAdmin;
    
    if (!isAdmin) {
      throw new ForbiddenException('Admin privileges required');
    }

    return true;
  }
}