import 'jest';

export const e2eTestData = {
  user: {
    endpoint: '/users',
    testUser: {
      username: 'tester',
      email: 'test@test.com',
      password: 'QQww!!22',
    },
    adminUser: {
      username: 'admin',
      email: 'admin@test.com',
      password: 'QQww!!22',
    },
  },
  auth: {
    endpoint: '/auth',
  },
  goal: {
    endpoint: '/goals',
  },
  subgoal: {
    endpoint: '/subgoals',
  },
};
