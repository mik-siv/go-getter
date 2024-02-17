import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../user/entities/user-roles.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: {
            roles: [UserRole.USER],
          },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER]);
    const checkPermissionsMock = jest.fn().mockReturnValue(true);
    //saving initial implementation
    const { checkUserPermissionForRoles } = RolesGuard;
    //temporarily overriding with a mock
    RolesGuard.checkUserPermissionForRoles = checkPermissionsMock;
    expect(rolesGuard.canActivate(context)).toEqual(true);
    expect(checkPermissionsMock).toHaveBeenCalledWith(context.switchToHttp().getRequest().user, [UserRole.USER]);
    //resetting the initial implementation
    RolesGuard.checkUserPermissionForRoles = checkUserPermissionForRoles;
  });

  it('should deny access if user does not have required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
    expect(rolesGuard.canActivate(context)).toBe(false);
  });

  it('should deny access if user does not have all the required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER, UserRole.ADMIN]);
    expect(rolesGuard.canActivate(context)).toBe(false);
  });

  it('should throw an UnauthorizedException if user is undefined', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER, UserRole.ADMIN]);
    const contextWithNoUser = { ...context };
    contextWithNoUser.switchToHttp().getRequest().user = undefined;
    expect(() => rolesGuard.canActivate(contextWithNoUser)).toThrow(UnauthorizedException);
  });
});
