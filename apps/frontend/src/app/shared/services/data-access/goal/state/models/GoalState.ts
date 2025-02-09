import { GenericState } from '../../../../common/state/models/GenericState';
import { Goal } from '../../models/goal.model';

export type GoalsRecord = Record<string, Goal>;

export interface GoalState extends GenericState {
  goals: {
    goals: GoalsRecord;
    contributing_to: GoalsRecord;
  };
}
