import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    if (roles.some((role) => sessionService.hasRole(role))) {
      return true;
    }

    return router.createUrlTree(['/forbidden']);
  };
};
