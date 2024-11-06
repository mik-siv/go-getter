import { RequestStatus } from '../../../models/RequestStatus';

export interface AuthState {
  error: Error;
  status: RequestStatus;
  isAuthenticated: boolean;
  token: string;
}
