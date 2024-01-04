import { User } from '../../user/entities/user.entity';

export interface IAuthService {
    validate(email: string, password: string): Promise<User>;
    login(user: User): Promise<{ access_token: string }>;
}