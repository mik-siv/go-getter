import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from './local-auth.guard';
import { DTO_KEY } from '../../decorators/set-dto.decorator';
import { validateDto } from '../../utils/validation/dto-validation.util';
import { UserLoginDto } from '../dtos/user-login.dto';
import { Reflector } from '@nestjs/core';
import { LocalStrategy } from '../strategies/local.strategy';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryFake } from '../../mocks/user.repository.fake';

describe('LocalAuthGuard', () => {

    let guard: LocalAuthGuard;
    let canActivateSpy: jest.SpyInstance;
    let mockReflectorGet: jest.SpyInstance;
    let repository: UserRepositoryFake;
    let repositorySpy: jest.SpyInstance;
    let jwtServiceSpy: jest.SpyInstance;
    let localStrategy: LocalStrategy;

    beforeEach(async () => {
        repository = new UserRepositoryFake();
        const module: TestingModule = await Test.createTestingModule({
            providers: [LocalAuthGuard, { provide: AuthGuard('local'), useValue: { canActivate: jest.fn() } }, LocalStrategy, AuthService, UserService, { provide: 'UserRepository', useValue: repository }, JwtService],
        }).compile();

        guard = module.get<LocalAuthGuard>(LocalAuthGuard);
        mockReflectorGet = jest.spyOn(module.get<Reflector>(Reflector), 'get');
        canActivateSpy = jest.spyOn(module.get(AuthGuard('local')), 'canActivate');
        repositorySpy = jest.spyOn(repository, 'findBy');
        jwtServiceSpy = jest.spyOn(module.get<JwtService>(JwtService), 'sign')
        localStrategy = module.get<LocalStrategy>(LocalStrategy);
    });


    const mockExecutionContext = {
        switchToHttp: () => ({
            getRequest: jest.fn(() => ({
                body: { email: 'test@test.com', password: 'password' },
            })),
            getResponse: jest.fn(),
        }),
        getHandler: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should call validateDto with the correct arguments', async () => {
        canActivateSpy.mockReturnValue(true);
        mockReflectorGet.mockReturnValue(UserLoginDto);
        repositorySpy.mockReturnValue([{ id: '123', email: 'test@test.com', password: 'password' }]);
        jwtServiceSpy.mockReturnValue('token');
        jest.spyOn(localStrategy, 'validate').mockResolvedValue({ id: '123', email: 'testuser', password: 'password', username: 'testuser', created_date: new Date(), roles: [] });
        const expectedBody = { email: 'test@test.com', password: 'password' };
        const expectedDto = UserLoginDto;

        await guard.canActivate(mockExecutionContext as any);

        expect(mockReflectorGet).toHaveBeenCalledWith(DTO_KEY, mockExecutionContext.getHandler());
        expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
        expect(validateDto).toHaveBeenCalledWith(expectedBody, expectedDto);
    });
});
