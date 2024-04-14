import { INestApplication } from '@nestjs/common';
import { e2eTestData } from '../e2e-test-data';
import * as request from 'supertest';
import { login } from '../helpers/auth.e2e.helper';
import * as Joi from 'joi';
import { e2eTestBootstrap } from '../helpers/bootstrap.helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const {
    auth: { endpoint },
    user: { testUser },
  } = e2eTestData;
  beforeAll(async () => {
    app = await e2eTestBootstrap();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Login as an invalid user', async () => {
    const fakeUserData = {
      email: 'fake@email.com',
      password: 'password',
    };
    await request(app.getHttpServer())
      .post(`${endpoint}/login`)
      .send({
        email: fakeUserData.email,
        password: fakeUserData.password,
      })
      .expect(401);
  });

  it('Login as a valid user', async () => {
    const authToken = await login(testUser.email, testUser.password, app);
    Joi.assert(authToken, Joi.string().required().min(8));
  });
});
