import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export async function login(email: string, password: string, app: INestApplication){
  const { body: { access_token } } = await request(app.getHttpServer()).post('/auth/login').send({ email, password });
  return access_token
}