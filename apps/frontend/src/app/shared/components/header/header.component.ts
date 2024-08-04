import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RoutePaths } from '../../../app.routes';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/data-access/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);

  RoutePaths = RoutePaths;

  get isLoggedIn(): boolean {
    return !!this.authService.user();
  }

  logout(): void {
    this.authService.logOut();
  }
}
