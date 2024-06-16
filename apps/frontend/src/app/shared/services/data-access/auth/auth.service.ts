import { computed, Injectable, signal } from '@angular/core';
import { RestfulService } from '../restful.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface AuthResponse {
  access_token?: string;
  username: string;
  id: string;
  roles: string[];
  goals: string[];
  subgoals: string[];
  contributing_to: string[];
}

export type RequestStatus = 'pending' | 'success' | 'error';

export interface AuthState {
  error?: string;
  status: RequestStatus;
  access_token?: string;
  user?: Omit<AuthResponse, 'access_token'>;
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
    status: 'pending',
  });

  // selectors
  user = computed(() => this.state().user);
  token = computed(() => computed(() => this.state().access_token));

  login(email: string, password: string): Observable<AuthResponse> {
    return this.post(`${this.baseUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          this.state.set({ ...this.state(), error: error.message, status: 'error' });
          throw error; // Re-throw the error for component handling
        }),
        map((response) => {
          const { access_token, ...user } = response;
          this.state.set({
            ...this.state(),
            user: user, // Update user information
            access_token: access_token,
            error: undefined,
            status: 'success', // Set status to 'success' on success
          });
          return response;
        }),
      );

  }
}
