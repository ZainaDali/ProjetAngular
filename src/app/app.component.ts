import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePipe } from './shared/pipes/role.pipe';
import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RolePipe],
  template: `
    <div class="min-h-screen bg-gray-100 text-gray-800">
      <header class="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">MediNotes 🩺</h1>

        <!-- Display connected user -->
        <div *ngIf="auth.utilisateurCourant() as user" class="flex gap-2 items-center">
          <span>{{ user.nom }}</span>
          <span class="text-sm text-gray-200">({{ user.role | roleLabel }})</span>
          <button (click)="auth.deconnecter()" class="ml-4 text-sm underline">
            Déconnexion
          </button>
        </div>
      </header>

      <main class="p-6">
        
      </main>
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService); 
}
