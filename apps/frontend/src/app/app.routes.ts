import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';

export enum RoutePaths {
  Home = '',
  Auth = 'auth'
}

export const routes: Routes = [
  {
    path: RoutePaths.Home,
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
    canActivate: [isAuthenticatedGuard()],
  },
  {
    path: RoutePaths.Auth,
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: RoutePaths.Auth,
  },
];
