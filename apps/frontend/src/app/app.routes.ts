import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export enum RoutePaths {
  Home = ''
}

export const routes: Routes = [
  { path: RoutePaths.Home, component: HomeComponent },
];
