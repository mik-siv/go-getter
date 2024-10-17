import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RoutePaths } from '../../../app.routes';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../../services/data-access/auth/state/auth-state.service';
import { UserStateService } from '../../services/data-access/user/state/user-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authStateService = inject(AuthStateService);
  userStateService = inject(UserStateService);

  RoutePaths = RoutePaths;

  get isLoggedIn(): boolean {
    return !!this.userStateService.user();
  }

  logout(): void {
    this.authStateService.refreshState();
  }
}
