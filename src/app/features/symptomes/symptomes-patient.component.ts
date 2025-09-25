import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SymptomesService } from './symptomes.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { PatientNotificationsService } from '../../core/services/patient-notifications.service';
import { descriptionValidator } from '../../shared/validators/description.validator';
import { SymptomeItemComponent } from './symptome-item.component';

@Component({
  selector: 'app-symptomes-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SymptomeItemComponent
  ],
  template: `
    <div class="max-w-xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Mes symptômes</h2>

      <!-- Quick stats -->
      <div class="grid grid-cols-3 gap-3 mb-4 text-sm">
        <div class="bg-green-50 border border-green-200 p-3 rounded">
          <div class="font-semibold">Légers</div>
          <div class="text-2xl">{{ stats().leger }}</div>
        </div>
        <div class="bg-yellow-50 border border-yellow-200 p-3 rounded">
          <div class="font-semibold">Modérés</div>
          <div class="text-2xl">{{ stats().modere }}</div>
        </div>
        <div class="bg-red-50 border border-red-200 p-3 rounded">
          <div class="font-semibold">Graves</div>
          <div class="text-2xl">{{ stats().grave }}</div>
        </div>
      </div>

      <!-- Add/edit form -->
      <form [formGroup]="form" (ngSubmit)="soumettre()" class="space-y-4">
        <div>
          <label for="description" class="block text-sm font-medium mb-1">Description</label>
          <input type="text" formControlName="description"
                 class="w-full border px-3 py-2 rounded" />
          <div class="text-red-600 text-sm mt-1"
               *ngIf="form.controls.description.touched && form.controls.description.errors">
            <span *ngIf="form.controls.description.errors['required']">
              La description est obligatoire.
            </span>
            <span *ngIf="form.controls.description.errors['tropCourt']">
              La description doit contenir au moins 5 caractères.
            </span>
          </div>
        </div>

        <div>
          <label for="gravite" class="block text-sm font-medium mb-1">Gravité</label>
          <select formControlName="gravite" class="w-full border px-3 py-2 rounded">
            <option value="leger">Léger</option>
            <option value="modere">Modéré</option>
            <option value="grave">Grave</option>
          </select>
        </div>

        <button type="submit" [disabled]="form.invalid"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {{ symptomeEnEdition ? 'Mettre à jour' : 'Ajouter' }}
        </button>
      </form>

      <!-- List -->
      <ul class="mt-6 space-y-3">
        <app-symptome-item
          *ngFor="let s of mesSymptomes(); trackBy: trackById"
          [symptome]="s"
          (supprimer)="supprimer($event)"
          (editer)="editer($event)">
        </app-symptome-item>
      </ul>
    </div>
  `
})
export class SymptomesPatientComponent {
  fb = inject(FormBuilder);
  symptomesService = inject(SymptomesService);
  auth = inject(AuthService);
  notif = inject(NotificationsService);
  patientNotif = inject(PatientNotificationsService);

  userId = this.auth.utilisateurCourant()?.id ?? 0;
  symptomeEnEdition: { id: number } | null = null;

  form = this.fb.group({
    description: ['', [Validators.required, descriptionValidator()]],
    gravite: ['leger', Validators.required]
  });

  mesSymptomes = computed(() =>
    this.symptomesService.symptomes().filter(s => s.patientId === this.userId)
  );

  stats = computed(() => {
    const base = { leger: 0, modere: 0, grave: 0 };
    for (const s of this.mesSymptomes()) base[s.gravite]++;
    return base;
  });

  soumettre() {
    if (this.form.invalid || !this.auth.utilisateurCourant()) return;

    if (this.symptomeEnEdition) {
      // Update
      this.symptomesService.modifier(this.symptomeEnEdition.id, {
        description: this.form.value.description!,
        gravite: this.form.value.gravite! as 'leger' | 'modere' | 'grave'
      });
      this.notif.succes('Symptôme mis à jour.');
      this.symptomeEnEdition = null;
    } else {
      // Add
      this.symptomesService.ajouter({
        id: Date.now(),
        patientId: this.userId,
        patientNom: this.auth.utilisateurCourant()!.nom,
        date: new Date().toISOString(),
        description: this.form.value.description!,
        gravite: this.form.value.gravite! as 'leger' | 'modere' | 'grave'
      });
      this.notif.succes('Symptôme ajouté.');
    }

    this.form.reset({ gravite: 'leger' });
  }

  editer(symptome: { id: number; description: string; gravite: 'leger' | 'modere' | 'grave' }) {
    this.symptomeEnEdition = symptome;
    this.form.patchValue({
      description: symptome.description,
      gravite: symptome.gravite
    });
  }

  supprimer(id: number) {
    if (!confirm('Confirmer la suppression de ce symptôme ?')) return;
    this.symptomesService.supprimer(id);
    this.notif.info('Symptôme supprimé.');
  }

  trackById = (_: number, s: { id: number }) => s.id;

  constructor() {
    // Affiche des notifications patient pour nouvelles notes du médecin
    const events = this.patientNotif.nonLusPour(this.userId);
    for (const e of events) {
      this.notif.info(e.message);
    }
    if (events.length) {
      this.patientNotif.marquerCommeLus(this.userId);
    }
  }
}
