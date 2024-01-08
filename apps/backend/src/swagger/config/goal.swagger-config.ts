import { DocumentBuilder } from '@nestjs/swagger';
import { bearerSwaggerConfig } from './bearer.swagger-config';

export const goalSwaggerConfig = new DocumentBuilder()
  .setTitle('Goal service api docs')
  .setDescription('The Goal API description')
  .setVersion('1.0')
  .addBearerAuth(bearerSwaggerConfig)
  .build();
