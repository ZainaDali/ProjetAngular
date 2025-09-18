import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="text-center p-8">
      <h2 class="text-3xl font-bold text-green-600">Bienvenue sur MediNotes 🩺</h2>
      <p class="mt-4 text-lg text-gray-700">
        Cette application permet aux patients d'ajouter leurs symptômes du jour.
      </p>

      <!-- Boutons d'action -->
      <div class="mt-6 space-y-4">
        <!-- Bouton des symptômes (uniquement pour les patients) -->
        <div *ngIf="!auth.estMedecin()">
          <a routerLink="/symptomes" 
             class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Gérer mes symptômes 🤒
          </a>
        </div>

        <!-- Bouton de suivi pour les médecins -->
        <div *ngIf="auth.estMedecin()">
          <a routerLink="/suivi" 
             class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Accéder au suivi des patients 👨‍⚕️
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AccueilComponent {
  auth = inject(AuthService);
}
