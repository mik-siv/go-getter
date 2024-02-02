import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { IAuthService } from './interfaces/auth-service.interface';
import { UserJwtPayload } from './types/auth.types';
import { EntityWithId } from '../common/types/general.types';

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
    if (!user) throw new UnauthorizedException();
    const goals = await this.extractIDs(user.goals);
    const subgoals = await this.extractIDs(user.subgoals);
    const contributing_to = await this.extractIDs(user.contributing_to);
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

  /**
   * Extracts the IDs from an array of entities with IDs.
   * @param {Promise<EntityWithId[]>} relations - The promise representing the array of entities with IDs.
   * @returns {Promise<string[]>} - The promise representing the array of extracted IDs.
   * @private
   */
  private async extractIDs(relations: Promise<EntityWithId[]>): Promise<string[]> {
    return (await relations).map((relation) => relation.id);
  }
}
