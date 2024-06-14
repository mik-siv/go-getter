import { Injectable } from '@angular/core';
import { RestfulService } from '../restful.service';
import { Observable } from 'rxjs';

export interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RestfulService<any> {
  private baseUrl = '/api/auth';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.post(`${this.baseUrl}/login`, { email, password });
  }
}
