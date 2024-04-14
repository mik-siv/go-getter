import { BadRequestException, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { OwnedResource } from '../../constants/enums/owned-resources.enum';
import { RolesGuard } from '../roles/roles.guard';
import { UserJwtData } from '../../types/general.types';
import { ResourceOwnerGuard } from './resource-owner.guard';
import { UserRole } from '../../../user/entities/user-roles.enum';

jest.mock('../roles/roles.guard');
jest.mock('../../../user/user.service');

describe('ResourceOwnerGuard', () => {
  let guard: ResourceOwnerGuard;
  const reflectorMock = {
    getAllAndOverride: jest.fn().mockReturnValue([]),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  };
  let mockExecutionContext: ExecutionContext;
  const user: UserJwtData = {
    id: '123',
    goals: ['123', '456'],
    subgoals: ['789', '101112'],
    contributing_to: ['1', '2'],
    username: 'test_user',
    roles: [UserRole.USER],
  };
  const fakeUserService = {
    validateUserResourceAllowance: jest.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    guard = new ResourceOwnerGuard(reflectorMock as any, fakeUserService as any);
    mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user, params: { id: '123' } }),
      }),
    } as any as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it.each([
    ['goals', '123', true],
    ['goals', '999', false],
    ['subgoals', '789', true],
    ['contributing_to', '123', false],
    ['id', '123', true],
    ['id', '456', false],
  ])('should return %s when checking ownership of %s', async (resource, resourceId, expected) => {
    const checkFn = guard['checkResourceOwnership'](user, resourceId);
    expect(await checkFn(resource as any)).toEqual(expected);
  });

  it('should throw BadRequestException for invalid resource', async () => {
    const checkFn = guard['checkResourceOwnership'](user, '123');
    try {
      checkFn('invalid' as any);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should allow route activation based on user', async () => {
    const canActivateResult = await guard.canActivate(mockExecutionContext);
    expect(canActivateResult).toBe(true);
  });

  it('should throw an error if user is undefined', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue([OwnedResource.USER_ID]);
    (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user: undefined });
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should allow access if resource is not requested by id', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue([OwnedResource.USER_ID]);
    (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user, params: { id: undefined } });
    const canActivateResult = await guard.canActivate(mockExecutionContext);
    expect(canActivateResult).toBe(true);
  });

  it('should allow access based on owned resources using checkResourceOwnership', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue([OwnedResource.USER_ID, OwnedResource.CONTRIBUTING_TO]);
    const canActivateResult = await guard.canActivate(mockExecutionContext);
    expect(canActivateResult).toBe(true);
  });

  it('should allow access to an admin user', async () => {
    RolesGuard.checkUserPermissionForRoles = jest.fn().mockReturnValue(true);
    const canActivateResult = await guard.canActivate(mockExecutionContext);
    expect(canActivateResult).toBe(true);
  });
});
