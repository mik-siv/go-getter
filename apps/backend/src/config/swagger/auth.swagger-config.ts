import { DocumentBuilder } from '@nestjs/swagger';

export const authSwaggerConfig = new DocumentBuilder()
  .setTitle('Auth service api docs')
  .setDescription('The Auth API description')
  .setVersion('1.0')
  .build();