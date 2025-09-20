import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SymptomesService } from './symptomes.service';

@Component({
  selector: 'app-symptomes-medecin',
  standalone: true,
  imports: [CommonModule, RouterLink], // ✅ ajout de RouterLink
  template: `
    <div class="max-w-2xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Suivi global des patients</h2>

      <ul class="space-y-2">
        <li *ngFor="let patient of patients()">
          <a [routerLink]="['/suivi/patient', patient.id]" 
             class="text-blue-600 hover:underline">
            Voir symptômes de {{ patient.nom }}
          </a>
        </li>
      </ul>
    </div>
  `
})
export class SymptomesMedecinComponent {
  symptomesService = inject(SymptomesService);

  // Liste des patients uniques
  patients = computed(() => {
    const all = this.symptomesService.symptomes();
    const uniques = new Map<number, { id: number; nom: string }>();
    for (const s of all) {
      uniques.set(s.patientId, { id: s.patientId, nom: s.patientNom });
    }
    return Array.from(uniques.values());
  });
}
