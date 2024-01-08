import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { IAuthService } from './interfaces/auth-service.interface';
import { jwtPayload } from './types/auth.types';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validate(email: string, password: string): Promise<User> {
    const [foundUser]: User[] = await this.userService.findBy({ email });
    if (!foundUser) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return foundUser;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload: jwtPayload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
