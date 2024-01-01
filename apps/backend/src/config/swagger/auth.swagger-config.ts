import { DocumentBuilder } from '@nestjs/swagger';
import { bearerSwaggerConfig } from './bearer.swagger-config';

export const authSwaggerConfig = new DocumentBuilder()
  .setTitle('Auth service api docs')
  .setDescription('The Auth API description')
  .setVersion('1.0')
  .addBearerAuth(bearerSwaggerConfig)
  .build();