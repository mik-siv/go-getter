import { Roles, ROLES_KEY } from './role.decorator';
import { UserRole } from '../entities/user-roles.enum';

describe('Roles decorator', () => {
  it('should set metadata with the provided roles', () => {
    const roles = [UserRole.USER, UserRole.ADMIN];
    const route = {} as any;
    Roles(...roles)(route);
    expect(Reflect.getMetadata(ROLES_KEY, route)).toEqual(roles);
  });
});
