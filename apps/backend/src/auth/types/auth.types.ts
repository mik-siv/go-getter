import { UserRole } from '../../user/entities/user-roles.enum';

export type UserJwtPayload = {
  username: string;
  sub: string;
  roles: UserRole[];
};
