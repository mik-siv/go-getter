import { computed, Injectable, Signal, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RestfulService } from '../restful.service';
import { RequestStatus } from '../models/RequestStatus';
import { catchError } from 'rxjs/operators';
import { Goal, GoalsList } from '../../../models/goal.model';
import { environment } from '../../../../../environments/environment';
import { StatefulService } from '../models/StatefulService';

export interface GoalState {
  error: Error;
  status: RequestStatus;
  goals: GoalsList;
}

@Injectable({
  providedIn: 'root',
})
export class GoalService extends RestfulService implements StatefulService {
  private baseUrl = `${environment.baseUrl}goals`;

  private emptyState: GoalState = {
    error: undefined,
    status: undefined,
    goals: undefined,
  };

  //state
  private state = signal<GoalState>(this.emptyState);

  private updateState(state: Partial<GoalState>): void {
    this.state.update(currentState => ({ ...currentState, ...state }));
  };

  private setPendingState(): void {
    this.updateState({ status: RequestStatus.PENDING });
  }

  private removeGoalFromStateById(id: string): void {
    return this.updateState({
      goals: {
        contributing_to: this.contributing_to(),
        goals: this.goals().filter(goal => goal.id !== id),
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

  getGoals(): Observable<GoalsList> {
    this.setPendingState();
    return this.getAll<GoalsList>(`${this.baseUrl}/my-goals`)
      .pipe(
        catchError((error) => {
          this.updateState({ error, status: RequestStatus.ERROR });
          throw error;
        }),
        tap((response) => {
          const { goals, contributing_to } = response;
          this.updateState({
            error: undefined,
            status: RequestStatus.SUCCESS,
            goals: { goals, contributing_to },
          });
        }),
      );
  }

  deleteGoal(id: string): Observable<void> {
    this.setPendingState();
    return this.delete(`${this.baseUrl}`, id)
      .pipe(
        catchError((error) => {
          this.updateState({ error, status: RequestStatus.ERROR });
          throw error;
        }),
        tap(() => {
          this.removeGoalFromStateById(id);
        }),
      );
  }
}
