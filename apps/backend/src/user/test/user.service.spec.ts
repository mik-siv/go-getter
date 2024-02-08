import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepositoryMock } from './mocks/user.repository.mock';
import { User } from '../entities/user.entity';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { UserRole } from '../entities/user-roles.enum';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepositoryMock;
  let repoCreate: jest.SpyInstance;
  let repoSave: jest.SpyInstance;
  let repoFindOne: jest.SpyInstance;
  let repoFindBy: jest.SpyInstance;
  let repoRemove: jest.SpyInstance;
  let userData: any;
  const fakeId = 'be4fe9a7-0011-4c78-bd7d-fdf2a8a01cf0';

  const seedMockDataToRepo = async (data: any): Promise<any> => {
    return await repository.save(await repository.create(data));
  };

  beforeEach(async () => {
    repository = new UserRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: 'UserRepository', useValue: repository }],
    }).compile();

    service = module.get<UserService>(UserService);
    repoCreate = jest.spyOn(repository, 'create');
    repoSave = jest.spyOn(repository, 'save');
    repoFindOne = jest.spyOn(repository, 'findOne');
    repoFindBy = jest.spyOn(repository, 'findBy');
    repoRemove = jest.spyOn(repository, 'remove');
    userData = {
      username: 'Test',
      password: 'somepassword',
      email: 'test@test.com',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const user: User = await service.create(userData);
    const repoCallSchema = {
      email: userData.email,
      id: expect.any(String),
      password: expect.any(String),
      username: userData.username,
    };
    expect(user.id).toEqual(expect.any(String));
    expect(user.password).not.toEqual(userData.password);
    expect(repoCreate).toHaveBeenCalledWith(repoCallSchema);
    expect(repoSave).toHaveBeenCalledWith(repoCallSchema);
  });

  it('should throw an error on user with a duplicate email', async () => {
    await service.create(userData);
    await expect(service.create(userData)).rejects.toThrowError(ConflictException);
    await expect(service.create(userData)).rejects.toThrow('User with this email already exists');
  });

  it('should throw an error on invalid input data', async () => {
    repoSave.mockImplementation(() => {
      throw new Error('Error Saving User');
    });
    await expect(service.create(userData)).rejects.toThrowError('Error Saving User');
  });

  it('should find users by id', async () => {
    await seedMockDataToRepo({ id: fakeId, ...userData });
    expect(await service.findById(fakeId)).toEqual({ id: fakeId, ...userData });
    expect(repoFindOne).toBeCalledWith({ where: { id: fakeId } });
  });

  it('should throw an error if user is not found by id', async () => {
    try {
      await service.findById(fakeId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should patch a user', async () => {
    await seedMockDataToRepo({ id: fakeId, ...userData });
    const updatedData = { ...userData, username: 'Updated' };
    expect(await service.update(fakeId, updatedData as any)).toEqual({ id: fakeId, ...updatedData });
    expect(repoFindOne).toBeCalledWith({ where: { id: fakeId } });
    expect(repoSave).toBeCalledWith({ id: fakeId, ...updatedData });
  });

  it('should throw an error if user does not exist', async () => {
    try {
      await service.update(fakeId, userData as any);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
    expect(repoFindOne).toBeCalledWith({ where: { id: fakeId } });
  });

  it('should delete user by id', async () => {
    repoFindOne.mockReturnValue(userData);
    expect(await service.remove(fakeId)).toEqual(userData);
    expect(repoRemove).toBeCalledWith(userData);
  });

  it('should update user roles', async () => {
    const roles: UserRole[] = [UserRole.ADMIN, UserRole.USER];
    const updateUserRoleDto: UpdateUserRoleDto = { roles };
    await seedMockDataToRepo({ id: fakeId, ...userData });

    const updatedUser: User = await service.updateRoles(fakeId, updateUserRoleDto);

    const expectedUser: User = { id: fakeId, ...userData, roles: updateUserRoleDto.roles };
    expect(updatedUser).toEqual(expectedUser);

    expect(repoFindOne).toBeCalledWith({ where: { id: fakeId } });
    expect(repoSave).toBeCalledWith(expectedUser);
  });

  it('should throw an error when updating roles of non-existent user', async () => {
    const roles: UserRole[] = [UserRole.ADMIN, UserRole.USER];
    const updateUserRoleDto: UpdateUserRoleDto = { roles };

    try {
      await service.updateRoles(fakeId, updateUserRoleDto);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }

    expect(repoFindOne).toBeCalledWith({ where: { id: fakeId } });
  });
});
