import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user-roles.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata(roles, roles);
