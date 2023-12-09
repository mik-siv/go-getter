import { DocumentBuilder } from '@nestjs/swagger';

export const userSwaggerConfig = new DocumentBuilder()
  .setTitle('User service api docs')
  .setDescription('The User API description')
  .setVersion('1.0')
  .build();