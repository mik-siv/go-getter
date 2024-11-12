import { GoalsList } from '../../models/goal.model';
import { GenericState } from '../../../../common/state/models/GenericState';

export interface GoalState extends GenericState {
  goals: GoalsList;
}
