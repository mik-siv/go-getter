import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoutePaths } from '../../app.routes';
import { UserStateService } from '../services/data-access/user/state/user-state.service';

export const isAuthenticatedGuard = (): CanActivateFn => {
  return () => {
    const userStateService = inject(UserStateService);
    const router = inject(Router);

    if (userStateService.user()) {
      return true;
    }

    return router.parseUrl(RoutePaths.Auth);
  };
};
