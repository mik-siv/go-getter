import { inject, Injectable, signal } from '@angular/core';
import { RestfulService } from '../restful.service';
import { User } from '../../../models/user.model';
import { Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { UserStateService } from './state/user-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends RestfulService {
  private baseUrl = `${environment.baseUrl}users`;
  userStateService = inject(UserStateService);

  register(email: string, password: string, username: string): Observable<User> {
    this.userStateService.setPendingState()
    return this.post<User>(this.baseUrl, { email, password, username })
      .pipe(
        catchError((error) => {
          this.userStateService.setErrorState(error)
          throw error; // Re-throw the error for component handling
        }),
        tap((user) => {
          this.userStateService.setUser(user)
        }),
      );
  }
}
