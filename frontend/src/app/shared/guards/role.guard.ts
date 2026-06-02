import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminManagerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.loggedInUser()?.role;

  if (role === 'admin' || role === 'manager') {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
