import { INestApplication } from '@nestjs/common';
import { e2eTestData } from '../e2e-test-data';
import { bootstrap } from '../../src/main';
import { login } from '../helpers/auth.e2e.helper';
import * as request from 'supertest';
import * as Joi from 'joi';
import { subgoalResponseSchema } from '../schemas/subgoal.response-schema';

describe('Subgoals module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let subgoalId: string;
  let goalId: string;

  const {
    user: {
      testUser: { email, password },
    },
    subgoal: { endpoint },
    goal: { endpoint: goalsEndpoint },
  } = e2eTestData;

  beforeAll(async () => {
    app = await bootstrap();
    authToken = await login(email, password, app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get subgoals list', async () => {
    await request(app.getHttpServer())
      .get(endpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        Joi.assert(res.body, Joi.array().items(subgoalResponseSchema()).required());
      });
  });

  it('Create a new subgoal', async () => {
    const newSubgoal = {
      name: 'New Subgoal',
      private: false,
      metadata: {
        description: 'This is a new subgoal',
      },
    };
    const response = await request(app.getHttpServer())
      .post(endpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .send(newSubgoal)
      .expect(201)
      .expect((res) => Joi.assert(res.body, subgoalResponseSchema().required()));
    subgoalId = response.body.id;
  });

  it('Get the created subgoal', async () => {
    await request(app.getHttpServer())
      .get(`${endpoint}/${subgoalId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => Joi.assert(res.body, subgoalResponseSchema().required()));
  });

  it("Get a random goal's id", async () => {
    goalId = await request(app.getHttpServer())
      .get(goalsEndpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((res) => res.body[0].id);
  });

  it('Patch a subgoal with new data and a goal id', async () => {
    const patchData = {
      name: 'Updated Subgoal',
      private: true,
      metadata: {
        description: 'This is an updated subgoal',
      },
      goalIds: [goalId],
    };

    await request(app.getHttpServer())
      .patch(`${endpoint}/${subgoalId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(patchData)
      .expect(200)
      .expect((res) => {
        Joi.assert(res.body, subgoalResponseSchema().required());
        expect(res.body.goal_subgoals).toBeDefined();
        expect(res.body.goal_subgoals).toBeInstanceOf(Array);
        expect(res.body.goal_subgoals.length).toBeGreaterThan(0);
        expect(res.body.goal_subgoals[0].id).toEqual(goalId);
      });
  });

  it('Delete the created subgoal', async () => {
    await request(app.getHttpServer())
      .delete(`${endpoint}/${subgoalId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });
});
