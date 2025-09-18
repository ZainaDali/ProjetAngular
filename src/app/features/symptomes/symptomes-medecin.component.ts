import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SymptomesService } from './symptomes.service';

@Component({
  selector: 'app-symptomes-medecin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Suivi des patients</h2>

      <ul class="space-y-3">
        <li *ngFor="let s of symptomesService.symptomes()"
            class="border p-3 rounded">
          <div class="font-semibold text-blue-700">{{ s.patientNom }}</div>
          <div class="text-sm text-gray-600">{{ s.date | date:'short' }}</div>
          <div>{{ s.description }} ({{ s.gravite }})</div>
        </li>
      </ul>
    </div>
  `
})
export class SymptomesMedecinComponent {
  symptomesService = inject(SymptomesService);
}
