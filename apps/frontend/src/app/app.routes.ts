import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';

export enum RoutePaths {
  Home = '',
  Auth = 'auth'
}

export const routes: Routes = [
  {
    path: RoutePaths.Home,
    component: HomeComponent,
    canActivate: [isAuthenticatedGuard()],
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
