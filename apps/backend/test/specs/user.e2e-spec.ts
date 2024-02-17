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
      adminUser: { email, password },
      endpoint,
      testUser,
    },
  } = e2eTestData;
  let adminAuthToken: string;
  let nonAdminUserToken: string;
  let newUserId: string; // Store the ID of the created user for update and delete tests
  const createUserDto = {
    username: 'newuser',
    password: 'newpassword',
    email: 'newuser@example.com',
    roles: ['user'],
  };
  beforeAll(async () => {
    app = await bootstrap();
    adminAuthToken = await login(email, password, app);
    nonAdminUserToken = await login(testUser.email, testUser.password, app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET User list', async () => {
    return request(app.getHttpServer())
      .get(endpoint)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(200)
      .expect((res) => {
        Joi.assert(res.body, Joi.array().items(userResponseSchema()).required());
      });
  });

  it('POST Create User', async () => {
    const createResponse = await request(app.getHttpServer())
      .post(endpoint)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .send(createUserDto)
      .expect(201);

    newUserId = createResponse.body.id; // Store the ID for future tests

    // Assert the response body schema
    Joi.assert(createResponse.body, userResponseSchema());
  });

  it('GET Single User', async () => {
    const getSingleResponse = await request(app.getHttpServer())
      .get(`${endpoint}/${newUserId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(200);

    // Assert the response body schema for a single user
    Joi.assert(getSingleResponse.body, userResponseSchema());
  });

  it('PATCH User', async () => {
    const updateUserDto = {
      username: 'updatedusername',
    };

    const updateResponse = await request(app.getHttpServer())
      .patch(`${endpoint}/${newUserId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .set('Content-Type', 'application/json')
      .send(updateUserDto)
      .expect(200);

    // Assert the response body schema after update
    Joi.assert(updateResponse.body, userResponseSchema());
  });

  it('PATCH grant user admin role', async () => {
    const updateRolesDto = { roles: ['admin'] };
    const response = await request(app.getHttpServer())
      .patch(`${endpoint}/roles/${newUserId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .set('Content-Type', 'application/json')
      .send(updateRolesDto)
      .expect(200);

    expect(response.body.roles).toEqual(updateRolesDto.roles);
  });

  it('PATCH remove user admin role', async () => {
    const updateRolesDto = { roles: [] };
    const response = await request(app.getHttpServer())
      .patch(`${endpoint}/roles/${newUserId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .set('Content-Type', 'application/json')
      .send(updateRolesDto)
      .expect(200);

    expect(response.body.roles).toEqual(updateRolesDto.roles);
  });

  describe('RBAC asserts', () => {
    it('GET Users list', async () => {
      await request(app.getHttpServer()).get(endpoint).set('Authorization', `Bearer ${nonAdminUserToken}`).expect(403);
    });
  });

  it('DELETE User', async () => {
    await request(app.getHttpServer())
      .delete(`${endpoint}/${newUserId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(204);
  });

  it('Assert User deleted', async () => {
    await request(app.getHttpServer())
      .get(`${endpoint}/${newUserId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(404);
  });
});
