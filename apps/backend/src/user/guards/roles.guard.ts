import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user-roles.enum';
import { ROLES_KEY } from '../decorators/role.decorator';

/**
 * A guard that checks if a user has the required roles to access a route.
 * It implements the CanActivate interface from the Nest.js framework.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the user is authorized to access the given endpoint by the RBAC.
   *
   * @param {ExecutionContext} context - The execution context of the current request.
   * @returns {boolean} - Returns true if the user is authorized, otherwise false.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const user = context.switchToHttp().getRequest().user;
    return user && requiredRoles.every((role) => user.roles.includes(role));
  }
}
