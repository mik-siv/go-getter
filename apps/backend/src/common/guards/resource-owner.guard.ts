import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OwnedResource } from './owned-resources.enum';
import { RESOURCES_KEY } from '../decorators/resource.decorator';
import { UserJwtData } from '../types/general.types';

/**
 * ResourceOwnerGuard class is a guard that checks if the current user is the owner of the requested resource.
 * It implements the CanActivate interface from the @nestjs/common module.
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  /**
   * Determines whether the user is authorized to access a particular resource by ownership.
   * @param {ExecutionContext} context - The execution context.
   * @returns {boolean} True if the user is authorized, false otherwise.
   * @throws {UnauthorizedException} If the user is not authenticated.
   */
  canActivate(context: ExecutionContext): boolean {
    const ownedResources = this.reflector.getAllAndOverride<OwnedResource[]>(RESOURCES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!ownedResources) return true;

    const request = context.switchToHttp().getRequest();
    const user: UserJwtData = request.user;
    if (!user) throw new UnauthorizedException();
    const resourceId: string = request.params?.id;

    if (!resourceId) return true;

    return ownedResources.some(this.checkResourceOwnership(user, resourceId));
  }

  /**
   * Checks if the specified user has ownership of the given resource.
   * @param {UserJwtData} user - The user object to check ownership for.
   * @param {string} resourceId - The ID of the resource to check ownership on.
   * @returns {Function} - A function that takes a resource object and returns a boolean value indicating ownership.
   * @private
   */
  private checkResourceOwnership(user: UserJwtData, resourceId: string): (resource: OwnedResource) => boolean {
    return (resource: OwnedResource): boolean => {
      if (Array.isArray(user[resource])) {
        return user[resource].includes(resourceId);
      } else if (resource === OwnedResource.USER_ID) {
        return user[resource] === resourceId;
      } else {
        throw new BadRequestException('Invalid resource requested');
      }
    };
  }
}