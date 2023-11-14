import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { e2eTestData } from '../e2e-test-data';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const { user: { testUser: { email, password }, endpoint } } = e2eTestData;
  let authToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    const { body: { access_token } } = await request(app.getHttpServer()).post('/auth/login').send({ email, password });
    authToken = access_token;

  });

  it('GET User list', async () => {
    return request(app.getHttpServer()).get(endpoint).set('Authorization', `Bearer ${authToken}`).expect(200).expect(res=>{

    });
  });
});