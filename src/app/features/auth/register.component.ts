import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { motDePasseIdentiqueValidator } from './validators/password-match.validator';
import { Role } from './models';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 class="text-2xl font-semibold mb-4">Créer un compte</h2>

      <!-- Formulaire d'inscription -->
      <form [formGroup]="form" (ngSubmit)="soumettre()" class="space-y-4">

        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium mb-1">Nom</label>
          <input type="text" formControlName="nom" class="w-full border px-3 py-2 rounded" />
          <p *ngIf="form.get('nom')?.invalid && form.get('nom')?.touched" class="text-red-600 text-sm">
            Nom requis
          </p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium mb-1">E-mail</label>
          <input type="email" formControlName="email" class="w-full border px-3 py-2 rounded" />
          <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-red-600 text-sm">
            E-mail invalide
          </p>
        </div>

        <!-- Rôle -->
        <div>
          <label class="block text-sm font-medium mb-1">Rôle</label>
          <select formControlName="role" class="w-full border px-3 py-2 rounded">
            <option value="patient">Patient</option>
            <option value="medecin">Médecin (admin)</option>
          </select>
        </div>

        <!-- Mot de passe -->
        <div>
          <label class="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" formControlName="motDePasse" class="w-full border px-3 py-2 rounded" />
          <p *ngIf="form.get('motDePasse')?.invalid && form.get('motDePasse')?.touched" class="text-red-600 text-sm">
            8 caractères minimum
          </p>
        </div>

        <!-- Confirmation -->
        <div>
          <label class="block text-sm font-medium mb-1">Confirmation</label>
          <input type="password" formControlName="confirmation" class="w-full border px-3 py-2 rounded" />
          <p *ngIf="form.hasError('mismatch') && form.get('confirmation')?.touched" class="text-red-600 text-sm">
            Les mots de passe ne correspondent pas
          </p>
        </div>

        <!-- Bouton -->
        <button type="submit"
                [disabled]="form.invalid || chargement()"
                class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {{ chargement() ? 'Création…' : 'Créer le compte' }}
        </button>

        <!-- Messages -->
        <p *ngIf="erreur()" class="text-red-600 text-sm mt-2">{{ erreur() }}</p>
        <p *ngIf="succes()" class="text-green-700 text-sm mt-2">{{ succes() }}</p>
      </form>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  chargement = signal(false);
  erreur = signal<string | null>(null);
  succes = signal<string | null>(null);

  // ✅ Formulaire typé
  form = this.fb.group(
    {
      nom: this.fb.control('', [Validators.required, Validators.minLength(2)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      role: this.fb.control<Role>('patient'),
      motDePasse: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      confirmation: this.fb.control('', [Validators.required])
    },
    { validators: motDePasseIdentiqueValidator('motDePasse', 'confirmation') }
  );

  async soumettre() {
    if (this.form.invalid) return;

    this.chargement.set(true);
    this.erreur.set(null);
    this.succes.set(null);

    try {
      const { email, nom, role, motDePasse, confirmation } = this.form.getRawValue();

      const user = this.auth.inscrire({ email, nom, role, motDePasse, confirmation });

      this.succes.set(`Compte créé pour ${user.nom}. Vous pouvez vous connecter.`);

      // Redirection après une courte pause (UX sympa)
      setTimeout(() => this.router.navigate(['/auth/connexion']), 1000);

    } catch (e: any) {
      this.erreur.set(e?.message ?? 'Erreur lors de la création du compte.');
    } finally {
      this.chargement.set(false);
    }
  }
}
