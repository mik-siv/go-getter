import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const bearerSwaggerConfig: SecuritySchemeObject = {
  // I was also testing it without prefix 'Bearer ' before the JWT
  description: `[just text field] Please enter token in following format: Bearer <JWT>`,
  name: 'Authorization',
  bearerFormat: 'Bearer',
  scheme: 'Bearer',
  type: 'http',
  in: 'Header',
};
