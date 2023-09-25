import { Test, TestingModule } from '@nestjs/testing';
import { LocalAuthGuard } from './local-auth.guard';
import { Reflector } from '@nestjs/core';
import { DTO_KEY } from '../../decorators/set-dto.decorator';
import * as validateDtoModule from '../../utils/validation/dto-validation.util';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';


describe('LocalAuthGuard', () => {
    let guard: LocalAuthGuard;
    let reflector: Reflector;
    const mockUser = { email: 'test@test.com', password: 'password' }
    const { email, password } = mockUser;
    let mockDto: new () => any;

    // Mock ExecutionContext
    const context = {
        switchToHttp: () => ({
            getRequest: jest.fn(() => ({
                body: { email, password },
            })),
            getResponse: jest.fn(),
        }),
        getHandler: jest.fn(),
    };

    class MockLocalStrategy extends PassportStrategy(Strategy) {
        constructor() {
            super();
        }

        async validate(email: string, password: string): Promise<any> {
            return Promise.resolve({ email, password });
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LocalAuthGuard, Reflector, { provide: 'local', useClass: MockLocalStrategy }, AuthGuard('local')],
        }).compile();

        guard = module.get<LocalAuthGuard>(LocalAuthGuard);
        reflector = module.get<Reflector>(Reflector);
        mockDto = class { };
        jest.spyOn(reflector, 'get').mockReturnValue(mockDto);
        jest.spyOn(guard, 'handleRequest').mockImplementation(() => { return { email, password } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should call validateDto and super.canActivate with the correct arguments', async () => {
        const validateDtoMock = jest.spyOn(validateDtoModule, 'validateDto').mockResolvedValue(null);
        const superCanActivateMock = jest.spyOn(AuthGuard('local').prototype, 'canActivate').mockResolvedValue(true);

        const canActivateResult = await guard.canActivate(context as any);

        expect(reflector.get).toHaveBeenCalledWith(DTO_KEY, context.getHandler());
        expect(validateDtoMock).toHaveBeenCalledWith(expect.any(Object), mockDto);
        expect(superCanActivateMock).toHaveBeenCalledWith(context);
        expect(canActivateResult).toBe(true);
    });

    it('should fail if validateDto throws an error', async () => {
        jest.spyOn(validateDtoModule, 'validateDto').mockRejectedValue(new Error('test error'));
        try {
            await guard.canActivate(context as any)
        } catch (err) {
            expect(err).toEqual(new Error('test error'))
        }
    });

    it('should fail if super.canActivate throws an error', async () => {
        jest.spyOn(validateDtoModule, 'validateDto').mockResolvedValue(null);
        jest.spyOn(AuthGuard('local').prototype, 'canActivate').mockRejectedValue(new Error('test error'));
        try {
            await guard.canActivate(context as any)
        } catch (err) {
            expect(err).toEqual(new Error('test error'))
        }
    });
});