import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({}),
    getHandler: jest.fn(),
  } as any as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();
    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });
  it('should allow access to a public route', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => true); // Mock public route
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should delegate to the built-in AuthGuard for a protected route', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => false); // Mock protected route
    // Mocking the parent AuthGuard behavior
    jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockImplementation(() => true);

    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should deny access to a protected route when AuthGuard returns false', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => false); // Mock protected route
    // Mocking the parent AuthGuard behavior to return false
    jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockImplementation(() => false);

    expect(guard.canActivate(mockExecutionContext)).toBe(false);
  });
});
