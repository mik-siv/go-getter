import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoutePaths } from '../../app.routes';
import { AuthStateService } from '../services/data-access/auth/state/auth-state.service';

export const isAuthenticatedGuard = (): CanActivateFn => {
  return () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    if (authStateService.isAuthenticated()) {
      return true;
    }

    return router.parseUrl(RoutePaths.Auth);
  };
};
