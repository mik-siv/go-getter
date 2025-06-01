import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { e2eTestData } from '../e2e-test-data';

const {
  auth: { endpoint },
} = e2eTestData;

/**
 * Logs a user into the application with the provided email and password.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @param {INestApplication} app - The Nest application instance.
 * @return {Promise<string>} - The access token for the logged-in user.
 */
export async function login(email: string, password: string, app: INestApplication): Promise<string> {
  const {
    body: { access_token },
  } = await request(app.getHttpServer()).post(`${endpoint}/login`).send({ email, password });
  return access_token;
}

export async function whoAmI(accessToken: string, app: INestApplication) {
  const { body } = await request(app.getHttpServer())
    .get(`${endpoint}/profile`)
    .set('Authorization', `Bearer ${accessToken}`);
  return body;
}
