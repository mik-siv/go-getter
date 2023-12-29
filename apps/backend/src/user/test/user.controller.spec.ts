import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserRepositoryFake } from '../../common/mocks/user.repository.fake';
import { ConflictException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  const repository: UserRepositoryFake = new UserRepositoryFake();
  let service: UserService;
  let serviceCreate: jest.SpyInstance;
  const userData = {
    username: 'Test',
    password: 'somepassword',
    email: 'test@test.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, { provide: 'UserRepository', useValue: repository }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    serviceCreate = jest.spyOn(service, 'create');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    await controller.create(userData);
    expect(serviceCreate).toBeCalledTimes(1);
    expect(serviceCreate).toBeCalledWith(userData);
  });

  it('duplicate user registration', async () => {
    serviceCreate.mockImplementation(() => {
      throw new ConflictException('User Already Exists');
    });
    try {
      await controller.create(userData);
    } catch (e) {
      expect(e).toEqual(new ConflictException('User Already Exists'));
    }
  });

});
