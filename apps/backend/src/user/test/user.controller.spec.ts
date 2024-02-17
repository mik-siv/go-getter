import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserRepositoryMock } from './mocks/user.repository.mock';
import { ConflictException } from '@nestjs/common';
import { UserRole } from '../entities/user-roles.enum';

describe('UserController', () => {
  let controller: UserController;
  const repository: UserRepositoryMock = new UserRepositoryMock();
  let service: UserService;
  let serviceCreate: jest.SpyInstance;
  let serviceUpdateRoles: jest.SpyInstance;
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
    serviceUpdateRoles = jest.spyOn(service, 'updateRoles');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    await controller.create(userData);
    expect(serviceCreate).toBeCalledTimes(1);
    expect(serviceCreate).toBeCalledWith(userData);
  });

  it('should throw an error on duplicate user registration', async () => {
    serviceCreate.mockImplementation(() => {
      throw new ConflictException('User Already Exists');
    });
    try {
      await controller.create(userData);
    } catch (e) {
      expect(e).toEqual(new ConflictException('User Already Exists'));
    }
  });

  it('should update user roles', async () => {
    const updateUserRoleDto = {
      roles: [UserRole.ADMIN, UserRole.USER],
    };
    serviceUpdateRoles.mockReturnValue(true);
    const userId = '123456789';

    await controller.modifyRoles(userId, updateUserRoleDto);

    expect(service.updateRoles).toBeCalledTimes(1);
    expect(service.updateRoles).toBeCalledWith(userId, updateUserRoleDto);
  });
});
