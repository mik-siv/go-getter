import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { AuthServiceInterface } from './interfaces/auth-service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {
  }

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
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
