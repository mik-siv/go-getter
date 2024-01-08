import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerDocumentOptions } from '@nestjs/swagger/dist/interfaces';
import { SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up a swagger document for a given module
 * @param path - api path to a document
 * @param app - Nest app
 * @param config - Swagger document config
 * @param options - Swagger document options
 */
export const setupSwaggerForModule = (
  path: string,
  app: INestApplication,
  config: Omit<OpenAPIObject, 'paths'>,
  options?: SwaggerDocumentOptions,
) => {
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup(path, app, document);
};
