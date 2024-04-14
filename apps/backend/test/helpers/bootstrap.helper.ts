import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';

/**
 * Initializes and bootstraps the end-to-end test environment.
 * @returns {Promise<INestApplication>} Promise that resolves to the created Nest application.
 */

export const e2eTestBootstrap = async (): Promise<INestApplication> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  return module.createNestApplication();
};
