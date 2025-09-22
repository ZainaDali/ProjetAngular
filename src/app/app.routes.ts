import { Routes } from '@angular/router';
import { AccueilComponent } from './features/accueil/accueil.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { SymptomesPatientComponent } from './features/symptomes/symptomes-patient.component';
import { SymptomesMedecinComponent } from './features/symptomes/symptomes-medecin.component';
import { SymptomesAdminDetailComponent } from './features/symptomes/symptomes-admin-detail.component';

export const routes: Routes = [
  // Default redirection
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  // Home page (accessible only when connected)
  { path: 'accueil', component: AccueilComponent, canActivate: [authGuard] },

  // Symptoms page (connected patient)
  { path: 'symptomes', component: SymptomesPatientComponent, canActivate: [authGuard] },

  // Lazy load Auth (login / registration)
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },

  // Doctor space (global symptoms list)
  { path: 'suivi', component: SymptomesMedecinComponent, canActivate: [adminGuard] },

  // Doctor space → detail by patient
  { path: 'suivi/patient/:id', component: SymptomesAdminDetailComponent, canActivate: [adminGuard] },

  // Fallback route
  { path: '**', redirectTo: 'accueil' }
];
