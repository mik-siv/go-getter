import { Routes } from '@angular/router';

export enum AuthRoutePaths {
  Login = 'login',
  Register = 'register',
}

export const AUTH_ROUTES: Routes = [
  {
    path: AuthRoutePaths.Login,
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: AuthRoutePaths.Register,
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '',
    redirectTo: AuthRoutePaths.Login,
    pathMatch: 'full',
  },
];
