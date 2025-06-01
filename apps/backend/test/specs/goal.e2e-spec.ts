import { login, whoAmI } from '../helpers/auth.e2e.helper';
import { INestApplication } from '@nestjs/common';
import { e2eTestData } from '../e2e-test-data';
import * as request from 'supertest';
import * as Joi from 'joi';
import { goalResponseSchema } from '../schemas/goal.response-schema';
import { e2eTestBootstrap } from '../helpers/bootstrap.helper';

describe('Goals module (e2e)', () => {
  let app: INestApplication;
  let adminAuthToken: string;
  let userAuthToken: string;
  let userID: string;
  let goalId: string;
  let subgoalId: string;
  const {
    user: {
      adminUser: { email, password },
      testUser,
    },
    goal: { endpoint },
    subgoal: { endpoint: subgoalsEndpoint },
  } = e2eTestData;

  beforeAll(async () => {
    app = await e2eTestBootstrap();
    await app.init();
    adminAuthToken = await login(email, password, app);
    userAuthToken = await login(testUser.email, testUser.password, app);
    const UserData = await whoAmI(userAuthToken, app);
    userID = UserData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get Goals list', async () => {
    await request(app.getHttpServer())
      .get(endpoint)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(200)
      .expect((res) => {
        Joi.assert(res.body, Joi.array().items(goalResponseSchema()).required());
      });
  });

  it('Create a new goal', async () => {
    await request(app.getHttpServer())
      .post(endpoint)
      .set('Authorization', `Bearer ${adminAuthToken}`)
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
    await request(app.getHttpServer())
      .get(`${endpoint}/${goalId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(200)
      .expect((res) => {
        Joi.assert(res.body, goalResponseSchema().required());
        expect(res.body.id).toEqual(goalId);
      });
  });

  it("Get a random subgoal's id", async () => {
    subgoalId = await request(app.getHttpServer())
      .get(subgoalsEndpoint)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(200)
      .then((res) => res.body[0].id);
  });

  it('Update the created goal by id', async () => {
    await request(app.getHttpServer())
      .patch(`${endpoint}/${goalId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
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

  describe('RBAC asserts', () => {
    it('GET goals list', async () => {
      await request(app.getHttpServer()).get(endpoint).set('Authorization', `Bearer ${userAuthToken}`).expect(403);
    });

    it("GET other owner's goal", async () => {
      await request(app.getHttpServer())
        .get(`${endpoint}/${goalId}`)
        .set('Authorization', `Bearer ${userAuthToken}`)
        .expect(403);
    });
  });

  it('Add a contributor to a goal by Id', async () => {
    await request(app.getHttpServer())
      .patch(`${endpoint}/${goalId}/add-contributor/${userID}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.__contributors__.find((contributor: any) => contributor.id === userID).id).toEqual(userID);
      });
  });

  it('Goal should be reachable for a contributor after being assigned', async () => {
    await request(app.getHttpServer())
      .get(`${endpoint}/${goalId}`)
      .set('Authorization', `Bearer ${userAuthToken}`)
      .expect(200);
  });

  it('Remove a contributor from a goal by Id', async () => {
    await request(app.getHttpServer())
      .patch(`${endpoint}/${goalId}/stop-contributing/${userID}`)
      .set('Authorization', `Bearer ${userAuthToken}`)
      .expect(204);
  });

  it('Goal should be unreachable for non-contributor after being unassigned', async () => {
    await request(app.getHttpServer())
      .get(`${endpoint}/${goalId}`)
      .set('Authorization', `Bearer ${userAuthToken}`)
      .expect(403);
  });

  it('Delete the created goal by id', async () => {
    await request(app.getHttpServer())
      .delete(`${endpoint}/${goalId}`)
      .set('Authorization', `Bearer ${adminAuthToken}`)
      .expect(204);
  });
});
