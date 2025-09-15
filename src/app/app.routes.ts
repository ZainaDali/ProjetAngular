import { Routes } from '@angular/router';
import { AccueilComponent } from './features/accueil/accueil.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent, canActivate: [authGuard] },

  // Lazy load Auth
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },

  // Espace admin (exemple de route protégée médecin)
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./features/accueil/accueil.component').then(m => m.AccueilComponent) },

  { path: '**', redirectTo: 'accueil' }
];
