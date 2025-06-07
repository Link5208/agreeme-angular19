import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isTokenValid()) {
    return true;
  }

  // Store the attempted URL for redirecting
  const returnUrl = state.url || '/dashboard';
  router.navigate(['/login'], {
    queryParams: { returnUrl },
  });

  return false;
};
