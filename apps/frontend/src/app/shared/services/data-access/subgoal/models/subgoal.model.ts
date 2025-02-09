import { Goal } from '../../goal/models/goal.model';

export interface Subgoal {
  id?: string;
  name: string;
  private?: boolean;
  created_by?: Record<string, any>;
  parent?: Subgoal;
  metadata: SubgoalMetadata;
  goal_subgoals?: Goal;
}

export interface SubgoalMetadata {
  description: string;
}
