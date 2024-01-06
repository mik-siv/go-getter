import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepositoryMock } from '../../user/test/mocks/user.repository.mock';
import { UserService } from '../../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

describe('AuthService', () => {
  let service: AuthService;
  let repository: UserRepositoryMock;
  let userService: UserService;
  let findUser;
  let jwtService: JwtService

  beforeEach(async () => {
    repository = new UserRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UserService, { provide: 'UserRepository', useValue: repository }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService)
    findUser = jest.spyOn(userService, 'findBy')
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    userService.findBy = jest.fn().mockResolvedValue([]);
    const email = 'nonexistent@example.com';
    const password = 'password';

    await expect(service.validate(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const foundUser = { id: '1', email: 'user@example.com', password: 'hashedpassword' };
    userService.findBy = jest.fn().mockResolvedValue([foundUser]);
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    const email = 'user@example.com';
    const password = 'invalidpassword';

    await expect(service.validate(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return found user if email and password are valid', async () => {
    const foundUser = { id: '1', email: 'user@example.com', password: 'hashedpassword' };
    userService.findBy = jest.fn().mockResolvedValue([foundUser]);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    const email = 'user@example.com';
    const password = 'password';

    const result = await service.validate(email, password);
    expect(result).toEqual(foundUser);
  });
  it('should return an access token for a user', async () => {
    const user = { id: '1', username: 'user1' };
    const payload = { username: user.username, sub: user.id };
    jwtService.sign = jest.fn().mockReturnValue('access_token');
    const result = await service.login(user as any);
    expect(result).toEqual({ access_token: 'access_token' });
    expect(jwtService.sign).toHaveBeenCalledWith(payload);
  });
});


