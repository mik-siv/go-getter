export interface Goal {
  id: string;
  name: string;
  private: boolean;
  created_date: Date;
  created_by?: Record<string, any>;
  parent?: Goal;
  subgoals: Subgoal[];
  metadata: Record<string, any>;
}

export interface Subgoal {
  id: string;
  name: string;
  private: boolean;
  created_by?: Record<string, any>;
  parent?: Subgoal;
  metadata: Record<string, any>;
}
