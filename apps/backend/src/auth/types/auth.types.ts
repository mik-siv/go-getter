import { UserRole } from '../../user/entities/user-roles.enum';

export type UserJwtPayload = {
  username: string;
  id: string;
  roles: UserRole[];
  goals: string[];
  subgoals: string[];
  contributing_to: string[];
};
