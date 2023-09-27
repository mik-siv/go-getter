import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService = {
    login: jest.fn()
  }
  let fakeRequest = {
    body: {
      user: {
        email: 'test@test.com',
        password: 'test'
      }
    }
  }


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

  it('should login a user', async () => {
    let fakeAuthTokenData = { access_token: 'fake-access-token' }
    fakeAuthService.login.mockReturnValue(fakeAuthTokenData);
    const result = await controller.login(fakeRequest.body);
    expect(result).toEqual(fakeAuthTokenData);
    expect(fakeAuthService.login).toHaveBeenCalledWith(fakeRequest.body.user); // No need to access body.user here
    expect(fakeAuthService.login).toHaveBeenCalledTimes(1);
  })
});