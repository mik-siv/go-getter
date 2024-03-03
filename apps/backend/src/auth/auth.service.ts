import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { IAuthService } from './interfaces/auth-service.interface';
import { UserJwtPayload } from './types/auth.types';
import { DataUtils } from '../common/utils/data/data.util';
import { IUserService } from '../user/interfaces/user-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validate(email: string, password: string): Promise<User> {
    const [foundUser]: User[] = await this.userService.findBy({ email });
    if (!foundUser) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await this.validatePassword(password, foundUser.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return foundUser;
  }

  async login(user: User): Promise<{ access_token: string }> {
    if (!user) throw new UnauthorizedException();
    const goals = await DataUtils.extractRelationIds(user.goals);
    const subgoals = await DataUtils.extractRelationIds(user.subgoals);
    const contributing_to = await DataUtils.extractRelationIds(user.contributing_to);
    const payload: UserJwtPayload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      goals,
      subgoals,
      contributing_to,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
