import { computed, Injectable, signal } from '@angular/core';
import { RestfulService } from '../restful.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequestStatus } from '../models/RequestStatus';

export interface User {
  username: string;
  id: string;
  roles: string[];
  goals: string[];
  subgoals: string[];
  contributing_to: string[];
}

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
  private baseUrl = 'http://localhost:3000/api/auth';

  // state
  private state = signal<AuthState>({
    user: undefined,
    access_token: undefined,
    error: undefined,
    status: undefined,
  });

  // selectors
  user = computed(() => this.state().user);
  token = computed(() => this.state().access_token);
  status = computed(() => this.state().status);

  login(email: string, password: string): Observable<AuthResponse> {
    this.state.update(state => ({ ...state, status: RequestStatus.PENDING }));
    return this.post(`${this.baseUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          this.state.update((state) => ({ ...state, error: error.message, status: RequestStatus.ERROR }));
          throw error; // Re-throw the error for component handling
        }),
        map((response) => {
          const { access_token, ...user } = response;
          this.state.update(state => ({
            ...state,
            user: user, // Update user information
            access_token: access_token,
            error: undefined,
            status: RequestStatus.SUCCESS, // Set status to 'success' on success
          }));
          return response;
        }),
      );
  }
}
