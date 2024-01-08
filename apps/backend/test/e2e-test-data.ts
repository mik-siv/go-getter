import 'jest';
export const e2eTestData = {
  user: {
    endpoint: '/api/users',
    testUser: {
      username: 'tester',
      email: 'test@test.com',
      password: 'QQww!!22',
    },
  },
  auth: {
    endpoint: '/api/auth',
  },
  goal:{
    endpoint: '/api/goals'
  }
};
