import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../user/entities/user-roles.enum';
import { IUserService } from '../../../user/interfaces/user-service.interface';
import { UserService } from '../../../user/user.service';
import { OwnedResource } from '../../constants/enums/owned-resources.enum';
import { UserJwtData } from '../../types/general.types';
import { RolesGuard } from '../roles/roles.guard';
import { RESOURCES_KEY } from './resource.decorator';

/**
 * ResourceOwnerGuard class is a guard that checks if the current user is the owner of the requested resource.
 * It implements the CanActivate interface from the @nestjs/common module.
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(UserService)
    private readonly userService: IUserService,
  ) {}

  /**
   * Determines whether the user is authorized to access a particular resource by ownership.
   * @param {ExecutionContext} context - The execution context.
   * @returns {boolean} True if the user is authorized, false otherwise.
   * @throws {UnauthorizedException} If the user is not authenticated.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //extracting the needed resources to be owned to access route from metadata
    const ownedResources = this.reflector.getAllAndOverride<OwnedResource[]>(RESOURCES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    //allowing access if no resources are required
    if (!ownedResources || (Array.isArray(ownedResources) && ownedResources.length === 0)) return true;
    const request = context.switchToHttp().getRequest();
    const user: UserJwtData = request.user;
    if (!user) throw new UnauthorizedException();
    //always allowing access to admins
    if (RolesGuard.checkUserPermissionForRoles(user, [UserRole.ADMIN])) return true;
    const resourceId: string = request.params?.id;
    //allowing access if resource is not requested by id
    if (!resourceId) return true;
    //allowing access if requested resource id is stored in JWT token and user is not only a contributor
    if (!ownedResources.includes(OwnedResource.CONTRIBUTING_TO)) {
      if (ownedResources.some(this.checkResourceOwnership(user, resourceId))) {
        return true;
      }
    }
    //checking if required resource is not cached in JWT but exists in DB
    for (const resource of ownedResources) {
      if (await this.userService.validateUserResourceAllowance(user.id, resourceId, resource)) {
        return true;
      }
    }
    return false;
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
        return user[OwnedResource.USER_ID] === resourceId;
      } else {
        throw new BadRequestException('Invalid resource requested');
      }
    };
  }
}
