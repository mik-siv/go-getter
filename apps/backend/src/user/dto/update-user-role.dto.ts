import { UserRole } from '../entities/user-roles.enum';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}
