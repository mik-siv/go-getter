import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/common/local-storage/local-storage.service';
import { LocalStorageKeys } from '../services/common/local-storage/models/LocalStorageKeys';

export function AuthInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem(LocalStorageKeys.accessToken);
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }
  return next(req)
}
