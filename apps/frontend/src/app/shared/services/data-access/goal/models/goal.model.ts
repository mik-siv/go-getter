import { Subgoal } from '../../subgoal/models/subgoal.model';

export interface GoalsList {
  goals: Goal[];
  contributing_to?: Goal[];
}

export interface Goal {
  name: string;
  id: string;
  private: boolean;
  created_date: Date;
  created_by?: Record<string, any>;
  parent?: Goal;
  subgoals: Subgoal[];
  metadata: Record<string, any>;
}


