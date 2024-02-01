import { UserRole } from '../../user/entities/user-roles.enum';

export type jwtPayload = { username: string; sub: string; roles: UserRole[] };
