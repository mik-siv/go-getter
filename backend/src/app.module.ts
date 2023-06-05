import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [UserModule, GoalsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
