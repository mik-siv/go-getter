import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { RouteDto } from '../common/decorators/set-dto.decorator';
import { UserLoginDto } from './dtos/user-login.dto';
import { AuthenticatedUser, UserJwtData } from '../common/types/general.types';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @RouteDto(UserLoginDto)
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() body: UserLoginDto,
    @Request()
    req: {
      user: User;
      body: { email: string; password: string };
    },
  ): Promise<{ access_token: string }> {
    return await this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req: AuthenticatedUser): UserJwtData {
    return req.user;
  }
}
