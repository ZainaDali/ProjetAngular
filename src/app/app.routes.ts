import { Routes } from '@angular/router';
import { AccueilComponent } from './features/accueil/accueil.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { SymptomesPatientComponent } from './features/symptomes/symptomes-patient.component';
import { SymptomesMedecinComponent } from './features/symptomes/symptomes-medecin.component';

export const routes: Routes = [
  // Redirection par défaut
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  // Page accueil (accessible uniquement connecté)
  { path: 'accueil', component: AccueilComponent, canActivate: [authGuard] },

  // Page symptômes (patient connecté)
  { path: 'symptomes', component: SymptomesPatientComponent, canActivate: [authGuard] },

  // Lazy load Auth (connexion / inscription)
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },

  // Espace médecin (admin)
  { path: 'suivi', component: SymptomesMedecinComponent, canActivate: [adminGuard] },

  // Route fallback
  { path: '**', redirectTo: 'accueil' }
];
