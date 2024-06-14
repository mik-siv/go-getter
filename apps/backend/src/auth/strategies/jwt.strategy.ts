import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserJwtPayload } from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRET,
    });
  }

  async validate(payload: UserJwtPayload) {
    return {
      id: payload.id,
      username: payload.username,
      roles: payload.roles,
      goals: payload.goals,
      subgoals: payload.subgoals,
      contributing_to: payload.contributing_to,
    };
  }
}
