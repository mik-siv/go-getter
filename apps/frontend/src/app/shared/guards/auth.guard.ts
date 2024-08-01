import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/data-access/auth/auth.service';
import { RoutePaths } from '../../app.routes';

export const isAuthenticatedGuard = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.user()) {
      return true;
    }

    return router.parseUrl(RoutePaths.Auth);
  };
};
