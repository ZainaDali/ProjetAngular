import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; 
import { RolePipe } from './shared/pipes/role.pipe';
import { NotificationsComponent } from './core/notifications/notifications.component';
import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RolePipe, NotificationsComponent], 
  template: `
    <div class="min-h-screen bg-gray-100 text-gray-800">
      <app-notifications></app-notifications>

      <header class="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">MediNotes 🩺</h1>

        @if (user()) {
          <div class="flex gap-2 items-center">
            <span>{{ user()!.nom }}</span>
            <span class="text-sm text-gray-200">
              ({{ user()!.role | roleLabel }})
            </span>
            <button (click)="auth.deconnecter()" class="ml-4 text-sm underline">
              Déconnexion
            </button>
          </div>
        }
      </header>

      <main class="p-6">
        <router-outlet></router-outlet> 
      </main>
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService); 

  // computed() crée un signal dérivé, pour ne pas répéter auth.utilisateurCourant()
  user = computed(() => this.auth.utilisateurCourant());
}
