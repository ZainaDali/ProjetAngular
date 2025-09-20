import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { motDePasseValidator } from '../../shared/validators/motdepasse.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Créer un compte</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium mb-1">Nom</label>
          <input type="text" formControlName="nom" class="w-full border px-3 py-2 rounded" />
          <div class="text-red-600 text-sm mt-1"
               *ngIf="form.controls.nom.touched && form.controls.nom.errors?.['required']">
            Le nom est obligatoire.
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" formControlName="email" class="w-full border px-3 py-2 rounded" />
          <div class="text-red-600 text-sm mt-1"
               *ngIf="form.controls.email.touched && form.controls.email.errors">
            <span *ngIf="form.controls.email.errors['required']">L’email est obligatoire.</span>
            <span *ngIf="form.controls.email.errors['email']">Email invalide.</span>
          </div>
        </div>

        <!-- Mot de passe -->
        <div>
          <label class="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" formControlName="motDePasse" class="w-full border px-3 py-2 rounded" />
          <div class="text-red-600 text-sm mt-1"
               *ngIf="form.controls.motDePasse.touched && form.controls.motDePasse.errors">
            <span *ngIf="form.controls.motDePasse.errors['required']">Le mot de passe est obligatoire.</span>
            <span *ngIf="form.controls.motDePasse.errors['minlength']">Minimum 6 caractères.</span>
          </div>
        </div>

        <!-- Confirmation -->
        <div>
          <label class="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <input type="password" formControlName="confirmation" class="w-full border px-3 py-2 rounded" />
          <div class="text-red-600 text-sm mt-1"
               *ngIf="form.hasError('motDePasseMismatch') && form.controls.confirmation.touched">
            Les mots de passe ne correspondent pas.
          </div>
        </div>

        <!-- Rôle -->
        <div>
          <label class="block text-sm font-medium mb-1">Rôle</label>
          <select formControlName="role" class="w-full border px-3 py-2 rounded">
            <option value="patient">Patient</option>
            <option value="medecin">Médecin</option>
          </select>
        </div>

        <!-- Bouton -->
        <button type="submit"
                [disabled]="form.invalid"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Créer un compte
        </button>
      </form>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);

  form = this.fb.group(
    {
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', Validators.required],
      role: ['patient', Validators.required]
    },
    { validators: motDePasseValidator('motDePasse', 'confirmation') } // ✅ validator custom
  );

  onSubmit() {
  if (this.form.invalid) return;

  this.auth.inscrire({
    nom: this.form.value.nom!,
    email: this.form.value.email!,
    motDePasse: this.form.value.motDePasse!,
    confirmation: this.form.value.confirmation!, // ✅ ajouté
    role: this.form.value.role as 'patient' | 'medecin'
  });

  this.router.navigate(['/auth/login']);
}

}
