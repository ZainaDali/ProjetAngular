import { Component } from '@angular/core';

@Component({
  selector: 'app-accueil',
  standalone: true,
  template: `
    <div class="text-center p-8">
      <h2 class="text-3xl font-bold text-green-600">Bienvenue sur MediNotes 🩺</h2>
      <p class="mt-4 text-lg text-gray-700">
        Cette application permet aux patients d’ajouter leurs symptômes du jour.
      </p>
    </div>
  `,
})
export class AccueilComponent {}
