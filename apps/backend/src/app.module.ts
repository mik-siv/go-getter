import { Module, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { dataSourceOptions } from './common/db/data-source';
import { GoalModule } from './goal/goal.module';
import { validationSchema } from './common/utils/validation/environment-validation.schema';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { SubgoalModule } from './subgoal/subgoal.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ResourceOwnerGuard } from './common/guards/resource-owner/resource-owner.guard';
import { RolesGuard } from './common/guards/roles/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'frontend', 'dist'),
    }),
    UserModule,
    AuthModule,
    GoalModule,
    SubgoalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: ResourceOwnerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
