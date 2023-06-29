import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userRepositoryFake } from '../mocks/user.repository.fake';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useClass: userRepositoryFake },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const userData = {
      username: 'Test',
      password: 'somepassword',
      email: 'test@test.com',
    };
    const user = await service.create(userData);
    console.log(user);
  });
});
