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
        <!-- Name -->
        <div>
          <label for="nom" class="block text-sm font-medium mb-1">Nom</label>
          <input type="text" formControlName="nom" class="w-full border px-3 py-2 rounded" />
          @if (form.controls.nom.touched && form.controls.nom.errors?.['required']) {
            <div class="text-red-600 text-sm mt-1">Name is required.</div>
          }
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium mb-1">Email</label>
          <input type="email" formControlName="email" class="w-full border px-3 py-2 rounded" />
          @if (form.controls.email.touched && form.controls.email.errors) {
            <div class="text-red-600 text-sm mt-1">
              @if (form.controls.email.errors['required']) {
                <span>Email is required.</span>
              }
              @if (form.controls.email.errors['email']) {
                <span>Invalid email.</span>
              }
            </div>
          }
        </div>

        <!-- Password -->
        <div>
          <label for="mdp" class="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" formControlName="motDePasse" class="w-full border px-3 py-2 rounded" />
          @if (form.controls.motDePasse.touched && form.controls.motDePasse.errors) {
            <div class="text-red-600 text-sm mt-1">
              @if (form.controls.motDePasse.errors['required']) {
                <span>Password is required.</span>
              }
              @if (form.controls.motDePasse.errors['minlength']) {
                <span>Minimum 6 characters.</span>
              }
            </div>
          }
        </div>

        <!-- Confirmation -->
        <div>
          <label for="confmdp" class="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <input type="password" formControlName="confirmation" class="w-full border px-3 py-2 rounded" />
          @if (form.hasError('motDePasseMismatch') && form.controls.confirmation.touched) {
            <div class="text-red-600 text-sm mt-1">Passwords do not match.</div>
          }
        </div>

        <!-- Role -->
        <div>
          <label for="role" class="block text-sm font-medium mb-1">Rôle</label>
          <select formControlName="role" class="w-full border px-3 py-2 rounded">
            <option value="patient">Patient</option>
            <option value="medecin">Médecin</option>
          </select>
        </div>

        <!-- Button -->
        <button type="submit"
                [disabled]="form.invalid"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create account
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
    { validators: motDePasseValidator('motDePasse', 'confirmation') }
  );

  onSubmit() {
    if (this.form.invalid) return;

    this.auth.inscrire({
      nom: this.form.value.nom!,
      email: this.form.value.email!,
      motDePasse: this.form.value.motDePasse!,
      confirmation: this.form.value.confirmation!,
      role: this.form.value.role as 'patient' | 'medecin'
    });

    this.router.navigate(['/auth/connexion']);
  }
}
