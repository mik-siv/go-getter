import { computed, Injectable, signal } from '@angular/core';
import { RestfulService } from '../restful.service';
import { Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestStatus } from '../models/RequestStatus';
import { User } from '../../../models/user.model';
import { environment } from '../../../../../environments/environment';

export interface AuthResponse extends User {
  access_token: string;
}

export interface AuthState {
  error: string;
  status: RequestStatus;
  access_token?: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RestfulService<AuthResponse> {
  private baseUrl = `${environment.baseUrl}auth`;

  emptyState: AuthState = {
    user: undefined,
    access_token: undefined,
    error: undefined,
    status: undefined,
  };

  // state
  private state = signal<AuthState>(this.emptyState);

  // selectors
  user = computed(() => this.state().user);
  token = computed(() => this.state().access_token);
  status = computed(() => this.state().status);
  error = computed(() => this.state().error);

  login(email: string, password: string): Observable<AuthResponse> {
    this.state.update(state => ({ ...state, status: RequestStatus.PENDING }));
    return this.post(`${this.baseUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          this.state.update((state) => ({ ...state, error: error.message, status: RequestStatus.ERROR }));
          throw error; // Re-throw the error for component handling
        }),
        tap((response) => {
          const { access_token, ...user } = response;
          this.state.update(state => ({
            ...state,
            user: user, // Update user information
            access_token: access_token,
            error: undefined,
            status: RequestStatus.SUCCESS, // Set status to 'success' on success
          }));
        }),
      );
  }

  logOut(): void {
    this.state.set(this.emptyState);
  }
}
