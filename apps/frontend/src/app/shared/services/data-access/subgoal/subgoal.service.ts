import { inject, Injectable } from '@angular/core';
import { RestfulService } from '../restful.service';
import { environment } from '../../../../../environments/environment';
import { Subgoal } from './models/subgoal.model';
import { SubgoalStateService } from './state/subgoal-state.service';
import { catchError } from 'rxjs/operators';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubgoalService extends RestfulService {
  private baseUrl = `${environment.baseUrl}subgoals`;
  private subgoalStateService = inject(SubgoalStateService);

  createSubgoal(data: Subgoal): Observable<Subgoal> {
    this.subgoalStateService.setPendingState();
    return this.post<Subgoal>(this.baseUrl, data).pipe(
      catchError((error) => {
        this.subgoalStateService.setErrorState(error);
        throw error;
      }),
      tap(() => {
        this.subgoalStateService.setSuccessState();
      }),
    );
  }

  updateSubgoal(id: string, data: Subgoal): Observable<Subgoal> {
    this.subgoalStateService.setPendingState();
    return this.update<Subgoal>(this.baseUrl, id, data).pipe(
      catchError(error => {
        this.subgoalStateService.setErrorState(error);
        throw error;
      }),
      tap(() => {
        this.subgoalStateService.setSuccessState();
      }),
    );
  }

  deleteSubgoal(id: string): Observable<void> {
    this.subgoalStateService.setPendingState();
    return this.delete(`${this.baseUrl}`, id).pipe(
      catchError(error => {
        this.subgoalStateService.setErrorState(error);
        throw error;
      }),
      tap(() => {
        this.subgoalStateService.setSuccessState();
      }),
    )
  }
}
