import { Subgoal } from '../../subgoal/models/subgoal.model';
import { User } from '../../user/models/user.model';

export interface GoalsList {
  goals: Goal[];
  contributing_to?: Goal[];
}

export interface Goal {
  name: string;
  id: string;
  private: boolean;
  created_date: Date;
  created_by?: User;
  parent?: Goal;
  subgoals: Subgoal[];
  metadata: GoalMetadata
}

export interface GoalMetadata {
  description: string;
}
