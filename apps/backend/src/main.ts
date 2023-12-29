import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './user/user.module';
import { userSwaggerConfig } from './config/swagger/user.swagger-config';
import { authSwaggerConfig } from './config/swagger/auth.swagger-config';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  //Setting route prefix
  app.setGlobalPrefix('api');
  //Swagger setup
  const userDocument = SwaggerModule.createDocument(app, userSwaggerConfig, {
    include: [UserModule],
  });
  const authDocument = SwaggerModule.createDocument(app, authSwaggerConfig, {
    include: [AuthModule],
  });
  SwaggerModule.setup('api/user/document', app, userDocument);
  SwaggerModule.setup('api/auth/document', app, authDocument);


  await app.listen(3000);
}

bootstrap();
