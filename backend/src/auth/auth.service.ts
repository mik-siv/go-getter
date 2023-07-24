import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validate(email: string, password: string) {
    const [foundUser] = await this.userService.findByEmail(email);
    if (!foundUser) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return foundUser;
  }
}
