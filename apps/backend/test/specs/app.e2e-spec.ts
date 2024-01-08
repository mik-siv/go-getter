import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrap } from '../../src/main';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await bootstrap();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/api/').expect(200).expect('Ok');
  });
});
