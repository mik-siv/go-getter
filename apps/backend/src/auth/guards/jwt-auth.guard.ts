import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * A decorator to mark a route as public, not requiring authentication
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * A guard to protect the routes with required JWT token
 * @constructor {Reflector}
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
