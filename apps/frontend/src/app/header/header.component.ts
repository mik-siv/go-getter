import { Component, inject } from '@angular/core';
import { MaterialModule } from '../shared/material/material.module';
import { RoutePaths } from '../app.routes';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '../shared/services/data-access/auth/state/auth-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authStateService = inject(AuthStateService);

  RoutePaths = RoutePaths;

  get isLoggedIn(): boolean {
    return this.authStateService.isAuthenticated()
  }

  logout(): void {
    this.authStateService.refreshStateAndClearLocalStorage();
  }
}
