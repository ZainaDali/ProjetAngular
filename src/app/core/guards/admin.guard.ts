import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.utilisateurCourant();
  console.log('👤 Admin guard → current user:', user);

  if (user && user.role === 'medecin') {
    return true;
  }

  router.navigate(['/accueil']);
  return false;
};
