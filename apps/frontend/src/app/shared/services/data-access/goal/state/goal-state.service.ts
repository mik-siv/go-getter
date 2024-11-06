import { computed, Injectable, Signal } from '@angular/core';
import { RequestStatus } from '../../models/RequestStatus';
import { Goal, GoalsList } from '../models/goal.model';
import { StatefulService } from '../../models/StatefulService';
import { StateService } from '../../../common/state/state.service';
import { GoalState } from './models/GoalState';
import { emptyGoalState } from './models/EmptyGoalState';

@Injectable({
  providedIn: 'root',
})
export class GoalStateService extends StateService<GoalState> implements StatefulService<GoalState> {

  constructor() {
    super({ state: emptyGoalState, emptyState: emptyGoalState });
  }

  //selectors
  goals: Signal<Goal[]> = computed(() => this.state().goals?.goals);
  contributing_to: Signal<Goal[]> = computed(() => this.state().goals?.contributing_to);

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

  setGoals(goals: GoalsList): void {
    this.updateState({ goals, status: RequestStatus.SUCCESS, error: undefined });
  }
}
