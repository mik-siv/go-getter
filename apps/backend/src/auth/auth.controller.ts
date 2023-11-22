import { Controller, UseGuards, Request, Post, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RouteDto } from '../common/decorators/set-dto.decorator';
import { UserLoginDto } from './dtos/user-login.dto';
import { authenticatedUser } from '../common/types/general.types';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('login')
  @RouteDto(UserLoginDto)
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: UserLoginDto, @Request() req: { user: User, body: { email: string, password: string } }): Promise<{ access_token: string }> {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: authenticatedUser): authenticatedUser['user'] {
    return req.user;
  }
}

