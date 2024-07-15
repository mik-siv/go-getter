import { Component, effect, inject, signal } from '@angular/core';
import { MaterialModule } from '../shared/material/material.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from '../shared/services/data-access/auth/auth.service';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';
import { RoutePaths } from '../app.routes';
import { Router } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserService } from '../shared/services/data-access/user/user.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MaterialModule, LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  isLogin = signal(true);
  authEffect = effect(() => {
    if (this.authService.user()) {
      this.router.navigate([RoutePaths.Home]);
    }
  });

  get isAuthPending(): boolean {
    return this.authService.status() === RequestStatus.PENDING;
  }

  get isUserPending(): boolean {
    return this.userService.status() === RequestStatus.PENDING;
  }

  public get isPending(): boolean {
    return this.isLogin() ? this.isAuthPending : this.isUserPending;
  }
}
