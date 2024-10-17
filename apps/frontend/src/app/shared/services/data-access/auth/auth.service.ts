import { inject, Injectable } from '@angular/core';
import { RestfulService } from '../restful.service';
import { Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { UserStateService } from '../user/state/user-state.service';
import { AuthStateService } from './state/auth-state.service';

export interface AuthResponse extends User {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RestfulService {
  private userStateService = inject(UserStateService);
  private authStateService = inject(AuthStateService);
  private baseUrl = `${environment.baseUrl}auth`;

  login(email: string, password: string): Observable<AuthResponse> {
    this.authStateService.setPendingState()
    return this.post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          this.authStateService.setErrorState(error);
          throw error; // Re-throw the error for component handling
        }),
        tap((response) => {
          const { access_token, ...user } = response;
          this.authStateService.setAccessTokenSuccess(access_token);
          this.userStateService.setUser(user);
        }),
      );
  }
}
