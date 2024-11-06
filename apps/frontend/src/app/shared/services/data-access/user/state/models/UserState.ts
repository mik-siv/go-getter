import { RequestStatus } from '../../../models/RequestStatus';
import { User } from '../../models/user.model';

export interface UserState {
  error: Error;
  status: RequestStatus;
  user: User;
}
