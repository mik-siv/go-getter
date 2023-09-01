import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepositoryFake } from '../../mocks/user.repository.fake';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepositoryFake;
  let repoCreate, repoSave, userData;

  beforeEach(async () => {
    repository = new UserRepositoryFake();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useValue: repository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repoCreate = jest.spyOn(repository, 'create');
    repoSave = jest.spyOn(repository, 'save');
    userData = {
      username: 'Test',
      password: 'somepassword',
      email: 'test@test.com',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const user = await service.create(userData);
    const repoCallSchema: { [key: string]: any } = {
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
    const user = await service.create(userData);
    await expect(service.create(userData)).rejects.toThrowError(
      'User with this email already exists',
    );
  });
});
