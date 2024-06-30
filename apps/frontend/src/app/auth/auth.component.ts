import { Component, effect, inject, signal } from '@angular/core';
import { MaterialModule } from '../shared/material/material.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from '../shared/services/data-access/auth/auth.service';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';
import { RoutePaths } from '../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MaterialModule, LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isLogin = signal(true);
  authEffect = effect(() => {
    if (this.authService.user()) {
      this.router.navigate([RoutePaths.Home]);
    }
  });

  public get isAuthPending() {
    return this.authService.status() === RequestStatus.PENDING;
  }
}
