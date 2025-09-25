import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SymptomesService } from './symptomes.service';
import { GravitePipe } from '../../shared/pipes/gravite.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../core/notifications/notifications.service';

@Component({
  selector: 'app-symptomes-admin-detail',
  standalone: true,
  imports: [CommonModule, GravitePipe, HighlightDirective, ReactiveFormsModule, FormsModule],
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

          <!-- Notes du médecin -->
          <div class="mt-3 border-t pt-3">
            <div class="text-sm font-semibold mb-2">Notes du médecin</div>

            <div *ngIf="s.notes?.length; else noNotes">
              <ul class="space-y-2">
                <li *ngFor="let n of s.notes">
                  <div class="text-xs text-gray-500">{{ n.date | date:'short' }} — {{ n.auteur }}</div>
                  <div class="flex items-center gap-2">
                    <input *ngIf="noteEnEdition?.id === n.id; else viewMode"
                           class="flex-1 border rounded px-2 py-1"
                           [(ngModel)]="noteEditionContenu" name="note-{{n.id}}" />
                    <ng-template #viewMode>
                      <div class="flex-1">{{ n.contenu }}</div>
                    </ng-template>
                    <button class="text-blue-600 text-sm" (click)="editerNote(n)">
                      {{ noteEnEdition?.id === n.id ? 'Annuler' : 'Modifier' }}
                    </button>
                    <button *ngIf="noteEnEdition?.id === n.id"
                            class="text-green-600 text-sm" (click)="sauverNote(s.id, n.id)">Sauver</button>
                    <button class="text-red-600 text-sm" (click)="supprimerNote(s.id, n.id)">Supprimer</button>
                  </div>
                </li>
              </ul>
            </div>
            <ng-template #noNotes>
              <div class="text-sm text-gray-500">Aucune note pour ce symptôme.</div>
            </ng-template>

            <!-- Formulaire ajout de note -->
            <form [formGroup]="getForm(s.id)" (ngSubmit)="ajouterNote(s.id)" class="mt-3 flex gap-2">
              <input type="text" formControlName="contenu" placeholder="Ajouter une note..."
                     class="flex-1 border rounded px-3 py-2" />
              <button type="submit" [disabled]="getForm(s.id).invalid"
                      class="px-3 py-2 bg-blue-600 text-white rounded">Ajouter</button>
            </form>
          </div>
        </li>
      </ul>
    </div>
  `
})
export class SymptomesAdminDetailComponent {
  route = inject(ActivatedRoute);
  symptomesService = inject(SymptomesService);
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  notif = inject(NotificationsService);

  patientId = Number(this.route.snapshot.paramMap.get('id'));

  symptomesPatient = computed(() =>
    this.symptomesService.symptomes().filter(s => s.patientId === this.patientId)
  );

  // Map de formulaires par symptôme (clé: id)
  forms: Record<number, FormGroup> = {};
  noteEnEdition: { id: number } | null = null;
  noteEditionContenu = '';

  private ensureForm(symptomeId: number) {
    if (!this.forms[symptomeId]) {
      this.forms[symptomeId] = this.fb.group({
        contenu: ['', [Validators.required, Validators.minLength(2)]]
      });
    }
  }

  getForm(symptomeId: number): FormGroup {
    this.ensureForm(symptomeId);
    return this.forms[symptomeId];
  }

  ajouterNote(symptomeId: number) {
    this.ensureForm(symptomeId);
    const form = this.forms[symptomeId];
    if (form.invalid) return;
    const contenu = form.value.contenu as string;
    this.symptomesService.ajouterNote(symptomeId, {
      auteur: this.auth.utilisateurCourant()?.nom || 'Médecin',
      contenu
    });
    form.reset();
    this.notif.succes('Note ajoutée.');
  }

  editerNote(note: { id: number; contenu: string }) {
    if (this.noteEnEdition?.id === note.id) {
      this.noteEnEdition = null;
      this.noteEditionContenu = '';
    } else {
      this.noteEnEdition = { id: note.id };
      this.noteEditionContenu = note.contenu;
    }
  }

  sauverNote(symptomeId: number, noteId: number) {
    if (!this.noteEditionContenu.trim()) return;
    this.symptomesService.modifierNote(symptomeId, noteId, this.noteEditionContenu.trim());
    this.noteEnEdition = null;
    this.noteEditionContenu = '';
    this.notif.succes('Note mise à jour.');
  }

  supprimerNote(symptomeId: number, noteId: number) {
    if (!confirm('Confirmer la suppression de cette note ?')) return;
    this.symptomesService.supprimerNote(symptomeId, noteId);
    if (this.noteEnEdition?.id === noteId) {
      this.noteEnEdition = null;
      this.noteEditionContenu = '';
    }
    this.notif.info('Note supprimée.');
  }

  trackById = (_: number, s: { id: number }) => s.id;
}
