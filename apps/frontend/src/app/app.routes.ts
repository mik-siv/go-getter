import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export enum RoutePaths {
  Home = '',
  Auth = 'auth'
}

export const routes: Routes = [
  {
    path: RoutePaths.Home,
    component: HomeComponent,
  },
  {
    path: RoutePaths.Auth,
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: RoutePaths.Auth,
    pathMatch: 'full',
  },
];
