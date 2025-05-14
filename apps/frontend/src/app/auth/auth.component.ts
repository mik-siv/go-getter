import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from '../app.routes';
import { MaterialModule } from '../shared/material/material.module';
import { BrowserDetectorService } from '../shared/services/common/browser-detector/browser-detector.service';
import { AuthStateService } from '../shared/services/data-access/auth/state/auth-state.service';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';
import { UserStateService } from '../shared/services/data-access/user/state/user-state.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
    selector: 'app-auth',
    imports: [MaterialModule, LoginComponent, RegisterComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {
  userStateService = inject(UserStateService);
  authStateService = inject(AuthStateService);
  protected isMobile = inject(BrowserDetectorService).$isMobile;
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
