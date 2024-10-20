import { computed, Injectable, Signal, signal } from '@angular/core';
import { RequestStatus } from '../../models/RequestStatus';
import { Goal, GoalsList } from '../models/goal.model';
import { StatefulService } from '../../models/StatefulService';

export interface GoalState {
  error: Error;
  status: RequestStatus;
  goals: GoalsList;
}

@Injectable({
  providedIn: 'root',
})
export class GoalStateService implements StatefulService<GoalState> {
  private emptyState: GoalState = {
    error: undefined,
    status: undefined,
    goals: undefined,
  };

  //state
  readonly state = signal<GoalState>(this.emptyState);

  updateState(state: Partial<GoalState>): void {
    this.state.update(currentState => ({ ...currentState, ...state }));
  };

  setPendingState(): void {
    this.updateState({ status: RequestStatus.PENDING });
  }

  removeGoalFromStateById(id: string): void {
    return this.updateState({
      goals: {
        contributing_to: this.contributing_to().filter(goal => goal.id !== id),
        goals: this.goals().filter(goal => goal.id !== id),
      },
      status: RequestStatus.SUCCESS,
      error: undefined,
    });
  }

  removeContributingGoalFromState(id: string): void {
    return this.updateState({
      goals: {
        contributing_to: this.contributing_to().filter(goal => goal.id !== id),
        goals: this.goals(),
      },
      status: RequestStatus.SUCCESS,
      error: undefined,
    });
  }

  //selectors
  goals: Signal<Goal[]> = computed(() => this.state().goals?.goals);
  contributing_to: Signal<Goal[]> = computed(() => this.state().goals?.contributing_to);
  status: Signal<RequestStatus> = computed(() => this.state().status);
  error: Signal<Error> = computed(() => this.state().error);

  refreshState(): void {
    this.state.set(this.emptyState);
  }

  setErrorState(error: Error): void {
    this.updateState({ goals: undefined, error, status: RequestStatus.ERROR });
  }

  setGoals(goals: GoalsList): void {
    this.updateState({ goals, status: RequestStatus.SUCCESS, error: undefined });
  }
}
