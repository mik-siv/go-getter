import { Component, computed, effect, inject, signal } from '@angular/core';
import { MaterialModule } from '../shared/material/material.module';
import { LoginComponent } from './login/login.component';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';
import { RoutePaths } from '../app.routes';
import { Router } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserStateService } from '../shared/services/data-access/user/state/user-state.service';
import { AuthStateService } from '../shared/services/data-access/auth/state/auth-state.service';

@Component({
    selector: 'app-auth',
    imports: [MaterialModule, LoginComponent, RegisterComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {
  userStateService = inject(UserStateService);
  authStateService = inject(AuthStateService);
  router = inject(Router);
  isLogin = signal(true);
  isAuthenticated = computed (()=>this.authStateService.isAuthenticated());
  authEffect = effect(() => {
    if (this.isAuthenticated()) {
      this.router.navigate([RoutePaths.Home]);
    }
  });

  get isAuthPending(): boolean {
    return this.authStateService.status() === RequestStatus.PENDING;
  }

  get isUserPending(): boolean {
    return this.userStateService.status() === RequestStatus.PENDING;
  }

  public get isPending(): boolean {
    return this.isLogin() ? this.isAuthPending : this.isUserPending;
  }
}
