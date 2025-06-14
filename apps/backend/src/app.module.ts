import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { dataSourceOptions } from './common/db/data-source';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResourceOwnerGuard } from './common/guards/resource-owner/resource-owner.guard';
import { RolesGuard } from './common/guards/roles/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validationSchema } from './common/utils/validation/environment-validation.schema';
import { FileModule } from './file/file.module';
import { GoalModule } from './goal/goal.module';
import { SubgoalModule } from './subgoal/subgoal.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'frontend', 'dist', 'go-getter', 'browser'),
    }),
    UserModule,
    AuthModule,
    GoalModule,
    SubgoalModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceOwnerGuard,
    },
  ],
})
export class AppModule {}
