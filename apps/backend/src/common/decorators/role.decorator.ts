import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user-roles.enum';

export const ROLES_KEY = 'roles';

/**
 * Sets the metadata for the specified roles.
 *
 * @param {...UserRole[]} roles - The user roles to be set as metadata.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
