import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

/** Protège les routes qui nécessitent une session */
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estConnecte()) return true;
  // Redirige vers login avec returnUrl
  return router.createUrlTree(['/auth/connexion'], { queryParams: { returnUrl: state.url } });
};
