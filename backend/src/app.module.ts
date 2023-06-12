import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GoalsModule } from './goals/goals.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    GoalsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
