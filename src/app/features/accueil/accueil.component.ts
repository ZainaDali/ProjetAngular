import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { CommonModule } from '@angular/common';
import { TestApiService } from '../../core/services/test-api.service';

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

        <!-- Action buttons -->
      <div class="mt-6 space-y-4">
        <!-- Symptoms button (patients only) -->
        <div *ngIf="!auth.estMedecin()">
          <a routerLink="/symptomes" 
             class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Gérer mes symptômes 🤒
          </a>
        </div>

        <!-- Follow-up button for doctors -->
        <div *ngIf="auth.estMedecin()">
          <a routerLink="/suivi" 
             class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Accéder au suivi des patients 👨‍⚕️
          </a>
        </div>

        <!-- Stats link (connected) -->
        <div>
          <a routerLink="/stats"
             class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Voir mes statistiques 📊
          </a>
        </div>

        <!-- API test button -->
        <div class="mt-6">
          <button (click)="testerErreur()"
                  class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Tester API (Erreur volontaire)
          </button>
        </div>

        <!-- Message displayed after test -->
        <p *ngIf="message" class="mt-4 text-sm text-gray-700">{{ message }}</p>
      </div>
    </div>
  `,
})
export class AccueilComponent {
  auth = inject(AuthService);
  private api = inject(TestApiService);
  message = '';

  testerErreur() {
    this.api.getErreur().subscribe({
      next: () => this.message = 'Réponse inattendue reçue',
      error: () => this.message = 'Error caught by HttpErrorService ✅'
    });
  }
}
