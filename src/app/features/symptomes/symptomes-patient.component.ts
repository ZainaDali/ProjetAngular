import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SymptomesService } from './symptomes.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-symptomes-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Mes symptômes</h2>

      <!-- Formulaire d’ajout -->
      <form [formGroup]="form" (ngSubmit)="ajouter()" class="space-y-4">
        <div>
          <label>Description</label>
          <input type="text" formControlName="description"
                 class="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label>Gravité</label>
          <select formControlName="gravite" class="w-full border px-3 py-2 rounded">
            <option value="leger">Léger</option>
            <option value="modere">Modéré</option>
            <option value="grave">Grave</option>
          </select>
        </div>

        <button type="submit"
                [disabled]="form.invalid"
                class="bg-green-600 text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </form>

      <!-- Liste -->
      <ul class="mt-6 space-y-2">
        <li *ngFor="let s of symptomesService.getByPatient(userId)"
            class="border p-3 rounded flex justify-between">
          <span>
            {{ s.date | date:'short' }} - {{ s.description }} ({{ s.gravite }})
          </span>
          <button class="text-red-600" (click)="supprimer(s.id)">Supprimer</button>
        </li>
      </ul>
    </div>
  `
})
export class SymptomesPatientComponent {
  fb = inject(FormBuilder);
  symptomesService = inject(SymptomesService);
  auth = inject(AuthService);

  userId = this.auth.utilisateurCourant()?.id ?? 0;

  form = this.fb.group({
    description: ['', Validators.required],
    gravite: ['leger', Validators.required]
  });

  ajouter() {
    if (this.form.invalid || !this.auth.utilisateurCourant()) return;

    this.symptomesService.ajouter({
      id: Date.now(),
      patientId: this.userId,
      patientNom: this.auth.utilisateurCourant()!.nom,
      date: new Date().toISOString(),
      description: this.form.value.description!,
      gravite: this.form.value.gravite! as 'leger' | 'modere' | 'grave'
    });

    this.form.reset({ gravite: 'leger' });
  }

  supprimer(id: number) {
    this.symptomesService.supprimer(id);
  }
}
