import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { e2eTestData } from '../e2e-test-data';
import * as Joi from 'joi';
import { login } from '../helpers/auth.e2e.helper';
import { userResponseSchema } from '../schemas/user.response-schema';
import { bootstrap } from '../../src/main';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const {
    user: {
      testUser: { email, password },
      endpoint,
    },
  } = e2eTestData;
  let authToken: string;
  let newUserId: string; // Store the ID of the created user for update and delete tests
  const createUserDto = {
    username: 'newuser',
    password: 'newpassword',
    email: 'newuser@example.com',
    roles: ['user'],
  };
  beforeAll(async () => {
    app = await bootstrap();
    authToken = await login(email, password, app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET User list', async () => {
    return request(app.getHttpServer())
      .get(endpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        Joi.assert(
          res.body,
          Joi.array()
            .items(
              userResponseSchema()
            )
            .required(),
        );
      });
  });

  it('POST Create User', async () => {
    const createResponse = await request(app.getHttpServer())
      .post(endpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .send(createUserDto)
      .expect(201);

    newUserId = createResponse.body.id; // Store the ID for future tests

    // Assert the response body schema
    Joi.assert(
      createResponse.body,
      userResponseSchema()
    );
  });

  it('GET Single User', async () => {
    const getSingleResponse = await request(app.getHttpServer())
      .get(`${endpoint}/${newUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Assert the response body schema for a single user
    Joi.assert(
      getSingleResponse.body,
      userResponseSchema()
    );
  });

  it('PATCH User', async () => {
    const updateUserDto = {
      username: 'updatedusername',
    };

    const updateResponse = await request(app.getHttpServer())
      .patch(`${endpoint}/${newUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .set('Content-Type', 'application/json')
      .send(updateUserDto)
      .expect(200);

    // Assert the response body schema after update
    Joi.assert(
      updateResponse.body,
      userResponseSchema()
    );
  });

  it('DELETE User', async () => {
    await request(app.getHttpServer())
      .delete(`${endpoint}/${newUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });
});
