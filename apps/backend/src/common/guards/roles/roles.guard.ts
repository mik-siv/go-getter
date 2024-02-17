import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../user/entities/user-roles.enum';
import { ROLES_KEY } from './role.decorator';
import { UserJwtData } from '../../types/general.types';

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
    const requiredRoles: UserRole[] = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const user: UserJwtData = context.switchToHttp().getRequest().user;
    if (!user) throw new UnauthorizedException();
    return RolesGuard.checkUserPermissionForRoles(user, requiredRoles);
  }

  /**
   * Checks if a user has the required roles.
   * @param {UserJwtData} user - The user object containing role information.
   * @param {UserRole[]} requiredRoles - The array of required roles.
   * @return {boolean} - True if the user has all the required roles, false otherwise.
   */
  public static checkUserPermissionForRoles(user: UserJwtData, requiredRoles: UserRole[]): boolean {
    return user && requiredRoles.every((role) => user.roles.includes(role));
  }
}
