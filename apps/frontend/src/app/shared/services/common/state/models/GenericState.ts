import { RequestStatus } from '../../../data-access/models/RequestStatus';

export interface GenericState {
  error: Error;
  status: RequestStatus;
}
