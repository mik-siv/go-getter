import { computed, Injectable, Signal } from '@angular/core';
import { StateService } from '../../../common/state/state.service';
import { RequestStatus } from '../../models/RequestStatus';
import { StatefulService } from '../../models/StatefulService';
import { Goal, GoalsList } from '../models/goal.model';
import { emptyGoalState } from './models/EmptyGoalState';
import { GoalsRecord, GoalState } from './models/GoalState';

@Injectable({
  providedIn: 'root',
})
export class GoalStateService extends StateService<GoalState> implements StatefulService<GoalState> {

  constructor() {
    super({ state: emptyGoalState, emptyState: emptyGoalState });
  }

  //selectors
  goals: Signal<GoalsRecord> = computed(() => this.state().goals?.goals);
  contributing_to: Signal<GoalsRecord> = computed(() => this.state().goals?.contributing_to);

  removeGoalFromStateById(id: string): void {
    const { [id]: _, ...updatedGoals } = this.goals();

    this.updateState({
      goals: {
        contributing_to: this.contributing_to(),
        goals: updatedGoals,
      },
      status: RequestStatus.SUCCESS,
      error: undefined,
    });
  }

  removeContributingGoalFromState(id: string): void {
    const { [id]: _, ...updatedGoals } = this.contributing_to();

    return this.updateState({
      goals: {
        contributing_to: updatedGoals,
        goals: this.goals(),
      },
      status: RequestStatus.SUCCESS,
      error: undefined,
    });
  }

  addGoal(goal: Goal): void {
    return this.updateState({
      goals: {
        contributing_to: this.contributing_to(),
        goals: { ...this.goals(), goal },
      },
      status: RequestStatus.SUCCESS,
      error: undefined,
    });
  }

  updateGoal(goal: Goal): void {
    const [existingGoal, existingContribution] = [this.goals()[goal.id], this.contributing_to()[goal.id]];
    const updatedGoals = existingGoal ? { ...this.goals(), [goal.id]: goal } : (() => {
      const { [goal.id]: _, ...rest } = this.goals();
      return rest;
    })();

    const updatedContributions = existingContribution ? { ...this.contributing_to(), [goal.id]: goal } : (() => {
      const { [goal.id]: _, ...rest } = this.contributing_to();
      return rest;
    })();

    this.updateState({
      ...this.state(),
      goals: {
        goals: updatedGoals,
        contributing_to: updatedContributions,
      },
    });
  }

  setGoals(goals: GoalsList): void {
    this.updateState({ goals: this.mapGoalsListToObject(goals), status: RequestStatus.SUCCESS, error: undefined });
  }

  mapGoalsListToObject(list: GoalsList): { goals: GoalsRecord, contributing_to: GoalsRecord } {
    const arrayToObject = (array: Goal[]) => array.reduce((acc: Record<string, Goal>, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    return {
      goals: arrayToObject(list?.goals),
      contributing_to: arrayToObject(list?.contributing_to),
    };
  }
}
