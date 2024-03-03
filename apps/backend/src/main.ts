import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserModule } from './user/user.module';
import { userSwaggerConfig } from './swagger/config/user.swagger-config';
import { authSwaggerConfig } from './swagger/config/auth.swagger-config';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { goalSwaggerConfig } from './swagger/config/goal.swagger-config';
import { GoalModule } from './goal/goal.module';
import { setupSwaggerForModule } from './swagger/swagger.utils';
import { Logger } from '@nestjs/common';
import { RolesGuard } from './common/guards/roles/roles.guard';
import { ResourceOwnerGuard } from './common/guards/resource-owner/resource-owner.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log'] });
  //Setting global error filter
  app.useGlobalFilters(new GlobalExceptionFilter(new Logger('GlobalExceptionFilter')));
  //Setting global password strip interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  //Setting route prefix
  app.setGlobalPrefix('api');
  //Swagger setup
  setupSwaggerForModule('api/auth/document', app, authSwaggerConfig, {
    include: [AuthModule],
  });
  setupSwaggerForModule('api/goals/document', app, goalSwaggerConfig, {
    include: [GoalModule],
  });
  setupSwaggerForModule('api/users/document', app, userSwaggerConfig, {
    include: [UserModule],
  });

  await app.listen(3000);
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}

export { bootstrap };
