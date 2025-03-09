import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { RestfulService } from '../restful.service';
import { Goal, GoalsList } from './models/goal.model';
import { GoalStateService } from './state/goal-state.service';

@Injectable({
  providedIn: 'root',
})
export class GoalService extends RestfulService {
  private baseUrl = `${environment.baseUrl}goals`;
  private goalStateService = inject(GoalStateService);

  getGoals(): Observable<GoalsList> {
    this.goalStateService.setPendingState();
    return this.getAll<GoalsList>(`${this.baseUrl}/my-goals`)
      .pipe(
        catchError((error) => {
          this.goalStateService.setErrorState(error);
          throw error;
        }),
        tap((goals) => {
          this.goalStateService.setGoals(goals);
        }),
      );
  }

  deleteGoal(id: string): Observable<void> {
    this.goalStateService.setPendingState();
    return this.delete(`${this.baseUrl}`, id)
      .pipe(
        catchError((error) => {
          this.goalStateService.setErrorState(error);
          throw error;
        }),
        tap(() => {
          this.goalStateService.removeGoalFromStateById(id);
        }),
      );
  }

  createGoal(goal: Partial<Goal>): Observable<Goal> {
    this.goalStateService.setPendingState();
    return this.post<Goal>(`${this.baseUrl}`, goal)
      .pipe(
        catchError((error) => {
          this.goalStateService.setErrorState(error);
          throw error;
        }),
        tap((result) => {
          this.goalStateService.addGoal(result);
        }),
      );
  }

  removeGoalContributor(goalId: string, userId: string): Observable<Goal> {
    this.goalStateService.setPendingState();
    return this.update<Goal>(`${this.baseUrl}/${goalId}/stop-contributing`, userId, {} as Goal)
      .pipe(
        catchError((error) => {
          this.goalStateService.setErrorState(error);
          throw error;
        }),
        tap(() => {
          this.goalStateService.removeContributingGoalFromState(goalId);
        }),
      );
  }
}
