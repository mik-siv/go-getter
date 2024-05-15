import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Observable } from 'rxjs';

export interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends CrudService<any> {
  private baseUrl = '/api/auth';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.post(`${this.baseUrl}/login`, { email, password });
  }
}
