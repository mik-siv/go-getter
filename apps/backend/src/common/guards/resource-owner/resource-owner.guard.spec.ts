import { ResourceOwnerGuard } from './resource-owner.guard';
import { UserJwtData } from '../../types/general.types';
import { BadRequestException, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { OwnedResource } from '../../constants/enums/owned-resources.enum';
import { RolesGuard } from '../roles/roles.guard';

jest.mock('../roles/roles.guard');
describe('ResourceOwner guard', () => {
  let guard: ResourceOwnerGuard;
  const reflectorMock = { getAllAndOverride: jest.fn() };
  let mockExecutionContext: ExecutionContext;
  const user: UserJwtData = {
    id: '123',
    goals: ['123', '456'],
    subgoals: ['789', '101112'],
    contributing_to: ['1', '2'],
    username: 'test-user',
    roles: [],
  };
  const fakeUserService = {
    validateUserResourceAllowance: jest.fn(),
  };

  beforeEach(() => {
    guard = new ResourceOwnerGuard(reflectorMock as any, fakeUserService as any);
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({ getRequest: jest.fn() }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
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
  ])('should return %s when checking ownership of %s', (resource, resourceId, expected) => {
    const checkFn = guard['checkResourceOwnership'](user, resourceId);
    const result = checkFn(resource as any);
    expect(result).toBe(expected);
  });

  it('should throw BadRequestException for invalid resource', () => {
    const checkFn = guard['checkResourceOwnership'](user, '123');
    expect(() => checkFn('invalid' as any)).toThrow(BadRequestException);
  });

  it('should allow route activation based on user', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([]);
    const canActivateResult = guard.canActivate(mockExecutionContext);
    expect(canActivateResult).toBe(true);
  });

  it('should throw an error if user is undefined', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([OwnedResource.USER_ID]);
    (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user: undefined });
    expect(() => guard.canActivate(mockExecutionContext)).toThrow(new UnauthorizedException());
  });

  it('should allow access if resource is not requested by id', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([OwnedResource.USER_ID]);
    (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user, params: { id: undefined } });
    const canActivateResult = guard.canActivate(mockExecutionContext);
    expect(canActivateResult).toBe(true);
  });

  it('should allow access based on owned resources using checkResourceOwnership', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([OwnedResource.USER_ID, OwnedResource.CONTRIBUTING_TO]);
    (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user, params: { id: '123' } });
    const canActivateResult = guard.canActivate(mockExecutionContext);
    expect(canActivateResult).toBe(true);
  });

  it('should allow access to an admin user', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([
      OwnedResource.USER_ID,
      OwnedResource.CONTRIBUTING_TO,
      OwnedResource.SUBGOALS,
      OwnedResource.GOALS,
    ]);
    (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue({ user, params: { id: '123' } });
    RolesGuard.checkUserPermissionForRoles = jest.fn().mockReturnValue(true);
    expect(guard.canActivate(mockExecutionContext)).toEqual(true);
  });
});
