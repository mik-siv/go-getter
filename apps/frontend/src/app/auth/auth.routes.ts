import { Routes } from '@angular/router';

export enum AuthRoutePaths {
  Auth = '',
}

export const AUTH_ROUTES: Routes = [
  {
    path: AuthRoutePaths.Auth,
    loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
  }
];
