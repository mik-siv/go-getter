import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './user/user.module';
import { userSwaggerConfig } from './config/swagger/user.swagger-config';
import { authSwaggerConfig } from './config/swagger/auth.swagger-config';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*
   * Swagger setup
   */
  const userDocument = SwaggerModule.createDocument(app, userSwaggerConfig, {
    include: [UserModule],
  });
  const authDocument = SwaggerModule.createDocument(app, authSwaggerConfig, {
    include: [AuthModule],
  });
  SwaggerModule.setup('api/user/document', app, userDocument);
  SwaggerModule.setup('api/auth/document', app, authDocument);

  /*
   * Setting route prefix and port
   */
  app.setGlobalPrefix('api');
  await app.listen(3000);
}

bootstrap();
