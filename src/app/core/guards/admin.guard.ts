import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

/** Protège les routes réservées au rôle 'medecin' */
export const adminGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estConnecte() && auth.estMedecin()) return true;
  return router.createUrlTree(['/auth/connexion'], { queryParams: { returnUrl: state.url } });
};
