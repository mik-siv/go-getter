export interface Subgoal {
  id?: string;
  name: string;
  private?: boolean;
  created_by?: Record<string, any>;
  parent?: Subgoal;
  metadata: SubgoalMetadata;
}

export interface SubgoalMetadata {
  description: string;
}
