import { ResourceOwnerGuard } from './resource-owner.guard';
import { UserJwtData } from '../types/general.types';
import { BadRequestException, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { OwnedResource } from './owned-resources.enum';

describe('ResourceOwner guard', () => {
  let guard: ResourceOwnerGuard;
  const reflectorMock = { getAllAndOverride: jest.fn() };
  let mockExecutionContext: ExecutionContext;
  const user: UserJwtData = {
    userId: '123',
    goals: ['123', '456'],
    subgoals: ['789', '101112'],
    contributing_to: ['1', '2'],
    username: 'test-user',
    roles: [],
  };

  beforeEach(() => {
    guard = new ResourceOwnerGuard(reflectorMock as any);
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
    ['userId', '123', true],
    ['userId', '456', false],
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
});
