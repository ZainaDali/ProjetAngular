import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

/** Protects routes that require a session */
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estConnecte()) return true;
  // Redirect to login with returnUrl
  return router.createUrlTree(['/auth/connexion'], { queryParams: { returnUrl: state.url } });
};
