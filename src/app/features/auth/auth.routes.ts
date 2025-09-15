import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: 'connexion', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
  { path: 'inscription', loadComponent: () => import('./register.component').then(m => m.RegisterComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'connexion' }
];
