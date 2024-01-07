import { DocumentBuilder } from '@nestjs/swagger';
import { bearerSwaggerConfig } from './bearer.swagger-config';

export const userSwaggerConfig = new DocumentBuilder()
  .setTitle('User service api docs')
  .setDescription('The User API description')
  .setVersion('1.0')
  .addBearerAuth(bearerSwaggerConfig)
  .build();
