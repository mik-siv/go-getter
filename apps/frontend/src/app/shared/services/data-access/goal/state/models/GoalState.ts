import { RequestStatus } from '../../../models/RequestStatus';
import { GoalsList } from '../../models/goal.model';

export interface GoalState {
  error: Error;
  status: RequestStatus;
  goals: GoalsList;
}
