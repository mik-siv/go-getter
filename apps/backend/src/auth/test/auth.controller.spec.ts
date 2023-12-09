import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const fakeAuthService = {
    login: jest.fn()
  };
  const fakeRequest = {
    body: {
      user: {
        email: 'test@test.com',
        password: 'test'
      }
    }
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: fakeAuthService },]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  xit('should login a user', async () => {
    const fakeAuthTokenData = { access_token: 'fake-access-token' }
    fakeAuthService.login.mockReturnValue(fakeAuthTokenData);
    const result = await controller.login(fakeRequest.body as any, {} as any);
    expect(result).toEqual(fakeAuthTokenData);
    expect(fakeAuthService.login).toHaveBeenCalledWith(fakeRequest.body.user);
    expect(fakeAuthService.login).toHaveBeenCalledTimes(1);
  });

  xit('should return an error if login fails', async () => {
    fakeAuthService.login.mockRejectedValue(new Error('test error'));
    try {
      await controller.login(fakeRequest.body as any, {} as any);
    } catch (err) {
      expect(err).toEqual(new Error('test error'));
    }
  });
});