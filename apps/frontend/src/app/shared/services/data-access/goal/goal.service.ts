import { computed, Injectable, Signal, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RestfulService } from '../restful.service';
import { RequestStatus } from '../models/RequestStatus';
import { catchError } from 'rxjs/operators';
import { Goal, GoalsList } from '../../../models/goal.model';

export interface GoalState {
  error: string;
  status: RequestStatus;
  goals: GoalsList;
}

@Injectable({
  providedIn: 'root',
})
export class GoalService extends RestfulService<Goal> {
  private baseUrl = 'http://localhost:3000/api/goals';

  emptyState: GoalState = {
    error: undefined,
    status: undefined,
    goals: undefined,
  };

  //state
  private state = signal<GoalState>(this.emptyState);

  //selectors
  goals: Signal<Goal[]> = computed(() => this.state().goals?.goals);
  contributing_to: Signal<Goal[]> = computed(() => this.state().goals?.contributing_to);
  status: Signal<RequestStatus> = computed(() => this.state().status);
  error: Signal<string> = computed(() => this.state().error);

  getGoals(): Observable<GoalsList> {
    this.state.update(state => ({ ...state, status: RequestStatus.PENDING }));
    return this.getAll<GoalsList>(`${this.baseUrl}/my-goals`)
      .pipe(
        catchError((error) => {
          this.state.update((state) => ({ ...state, error: error.message, status: RequestStatus.ERROR }));
          throw error;
        }),
        tap((response) => {
          const { goals, contributing_to } = response;
          this.state.update(state => ({
            ...state,
            error: undefined,
            status: RequestStatus.SUCCESS,
            goals: { goals, contributing_to },
          }));
        }),
      );
  }
}
