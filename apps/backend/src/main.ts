import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserModule } from './user/user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('User example')
    .setDescription('The User API description')
    .setVersion('1.0')
    .addTag('user')
    .build();

  const userDocument = SwaggerModule.createDocument(app, options, {
    include: [UserModule],
  });
  SwaggerModule.setup('api/user', app, userDocument);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api')
  await app.listen(3000);
}
bootstrap();
