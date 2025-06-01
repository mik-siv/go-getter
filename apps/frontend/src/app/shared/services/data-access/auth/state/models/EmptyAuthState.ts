import { AuthState } from './AuthState';

export const emptyAuthState: AuthState = {
  isAuthenticated: false,
  error: undefined,
  status: undefined,
  token: undefined,
};
