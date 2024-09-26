import { computed, Injectable, signal } from '@angular/core';
import { RestfulService } from '../restful.service';
import { User } from '../../../models/user.model';
import { RequestStatus } from '../models/RequestStatus';
import { Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface UserState {
  error: string;
  status: RequestStatus;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends RestfulService<User> {
  private baseUrl = `${environment.baseUrl}users`;

  //state
  private state = signal<UserState>({
    user: undefined,
    error: undefined,
    status: undefined,
  });

  //selectors
  user = computed(() => this.state().user);
  status = computed(() => this.state().status);
  error = computed(() => this.state().error);

  register(email: string, password: string, username: string): Observable<User> {
    this.state.update(state => ({ ...state, status: RequestStatus.PENDING }));
    return this.post(this.baseUrl, { email, password, username })
      .pipe(
        catchError((error) => {
          this.state.update((state) => ({ ...state, error: error.message, status: RequestStatus.ERROR }));
          throw error; // Re-throw the error for component handling
        }),
        tap((response) => {
          this.state.update(state => ({
            ...state,
            user: response,
            error: undefined,
            status: RequestStatus.SUCCESS,
          }));
        }),
      );
  }
}
