import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHealthCheck(): string {
    return this.appService.getHealthCheck();
  }
}
