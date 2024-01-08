import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { e2eTestData } from '../e2e-test-data';

const { auth: { endpoint } } = e2eTestData;

export async function login(email: string, password: string, app: INestApplication) {
  const {
    body: { access_token },
  } = await request(app.getHttpServer()).post(`${endpoint}/login`).send({ email, password });
  return access_token;
}
