import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { e2eTestBootstrap } from '../helpers/bootstrap.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await e2eTestBootstrap();
    await app.init();
  });

  afterAll(async () => await app.close());

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Ok');
  });
});
