import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SymptomesService } from './symptomes.service';
import { GravitePipe } from '../../shared/pipes/gravite.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';

@Component({
  selector: 'app-symptomes-admin-detail',
  standalone: true,
  imports: [CommonModule, GravitePipe, HighlightDirective],
  template: `
    <div class="max-w-2xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Suivi du patient {{ patientId }}</h2>

      <ul class="space-y-3">
        <li *ngFor="let s of symptomesPatient(); trackBy: trackById"
            class="border p-3 rounded"
            [appHighlight]="s.gravite">
          <div class="text-sm text-gray-600">{{ s.date | date:'short' }}</div>
          <div class="font-medium">
            {{ s.patientNom }} : {{ s.description }} — 
            <span>{{ s.gravite | graviteLabel }}</span>
          </div>
        </li>
      </ul>
    </div>
  `
})
export class SymptomesAdminDetailComponent {
  route = inject(ActivatedRoute);
  symptomesService = inject(SymptomesService);

  patientId = Number(this.route.snapshot.paramMap.get('id'));

  symptomesPatient = computed(() =>
    this.symptomesService.symptomes().filter(s => s.patientId === this.patientId)
  );

  trackById = (_: number, s: { id: number }) => s.id;
}
