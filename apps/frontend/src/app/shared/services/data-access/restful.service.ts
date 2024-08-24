import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class RestfulService<T> {
  private http: HttpClient = inject(HttpClient)

  getAll<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(endpoint);
  }

  getById(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${endpoint}/${id}`);
  }

  post(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(endpoint, data);
  }

  update(endpoint: string, id: number, data: T): Observable<T> {
    return this.http.patch<T>(`${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${endpoint}/${id}`);
  }
}
