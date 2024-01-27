import { login } from '../helpers/auth.e2e.helper';
import { INestApplication } from '@nestjs/common';
import { e2eTestData } from '../e2e-test-data';
import * as request from 'supertest';
import * as Joi from 'joi';
import { goalResponseSchema } from '../schemas/goal.response-schema';
import { bootstrap } from '../../src/main';

describe('Goals module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let goalId: string;
  let subgoalId: string;
  const {
    user: {
      testUser: { email, password },
    },
    goal: { endpoint },
    subgoal: { endpoint: subgoalsEndpoint },
  } = e2eTestData;

  beforeAll(async () => {
    app = await bootstrap();
    authToken = await login(email, password, app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get Goals list', async () => {
    return request(app.getHttpServer())
      .get(endpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        Joi.assert(res.body, Joi.array().items(goalResponseSchema()).required());
      });
  });

  it('Create a new goal', async () => {
    return request(app.getHttpServer())
      .post(endpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'New Goal',
        metadata: {
          description: 'This is a new goal',
        },
        private: true,
      })
      .expect(201)
      .expect((res) => {
        Joi.assert(res.body, goalResponseSchema().required());
        goalId = res.body.id;
      });
  });

  it('Read the created goal by id', async () => {
    return request(app.getHttpServer())
      .get(`${endpoint}/${goalId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        Joi.assert(res.body, goalResponseSchema().required());
        expect(res.body.id).toEqual(goalId);
      });
  });

  it("Get a random subgoal's id", async () => {
    subgoalId = await request(app.getHttpServer())
      .get(subgoalsEndpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((res) => res.body[0].id);
  });

  it('Update the created goal by id', async () => {
    return request(app.getHttpServer())
      .patch(`${endpoint}/${goalId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Updated Goal',
        subgoals: [subgoalId],
        metadata: {
          description: 'This goal has been updated',
        },
        private: false,
      })
      .expect(200)
      .expect((res) => {
        Joi.assert(res.body, goalResponseSchema().required());
        expect(res.body.id).toEqual(goalId);
        expect(res.body.name).toEqual('Updated Goal');
        expect(res.body.metadata.description).toEqual('This goal has been updated');
        expect(res.body.private).toEqual(false);
        expect(res.body.subgoals[0].id).toEqual(subgoalId);
      });
  });

  it('Delete the created goal by id', async () => {
    return request(app.getHttpServer())
      .delete(`${endpoint}/${goalId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });
});
