import { UserRole } from '../../user/entities/user-roles.enum';

export type ObjectLiteral = { [key: string]: any };

export type UserJwtData = {
  userId: string;
  username: string;
  roles: UserRole[];
  goals: string[];
  subgoals: string[];
  contributing_to: string[];
};

export type AuthenticatedUser = {
  user: UserJwtData;
  [key: string]: any;
};

export type EntityWithId = { id: string } & ObjectLiteral;
