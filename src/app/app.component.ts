import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './features/auth/auth.service';
import { NotificationsComponent } from './core/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, NotificationsComponent],
  template: `
    <app-notifications></app-notifications>
    <div class="min-h-screen bg-gray-100 text-gray-800">
      <header class="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">
          <a routerLink="/accueil">MediNotes 🩺</a>
        </h1>
        <nav class="flex items-center gap-4">
          <ng-container *ngIf="auth.utilisateurCourant() as user">
            <span class="opacity-90">Bonjour, {{ user.nom }}</span>
            <button (click)="logout()"
                    class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
              Déconnexion
            </button>
          </ng-container>
        </nav>
      </header>
      <main class="p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  logout() {
    this.auth.deconnecter();
    this.router.navigate(['/auth/connexion']);
  }
}
