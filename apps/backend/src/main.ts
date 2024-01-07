import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './user/user.module';
import { userSwaggerConfig } from './config/swagger/user.swagger-config';
import { authSwaggerConfig } from './config/swagger/auth.swagger-config';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { goalSwaggerConfig } from './config/swagger/goal.swagger-config';
import { GoalModule } from './goal/goal.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Get the reflector for metadata scanning
  const reflector: Reflector = app.get(Reflector);
  //Setting global error filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  //Setting global password strip interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  //Setting global guards
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  //Setting route prefix
  app.setGlobalPrefix('api');
  //Swagger setup
  const userDocument = SwaggerModule.createDocument(app, userSwaggerConfig, {
    include: [UserModule],
  });
  const authDocument = SwaggerModule.createDocument(app, authSwaggerConfig, {
    include: [AuthModule],
  });
  const goalDocument = SwaggerModule.createDocument(app, goalSwaggerConfig, {
    include: [GoalModule]
  })
  SwaggerModule.setup('api/users/document', app, userDocument);
  SwaggerModule.setup('api/auth/document', app, authDocument);
  SwaggerModule.setup('api/goals/document', app, goalDocument)


  await app.listen(3000);
}

bootstrap();
