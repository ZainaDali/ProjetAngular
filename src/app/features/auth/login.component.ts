import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 class="text-2xl font-semibold mb-4">Connexion</h2>

      <form [formGroup]="form" (ngSubmit)="soumettre()" class="space-y-4">
        
        <!-- Champ e-mail -->
        <div>
          <label for="email" class="block text-sm font-medium mb-1">E-mail</label>
          <input type="email" formControlName="email" class="w-full border px-3 py-2 rounded" />
          @if (form.get('email')?.invalid && form.get('email')?.touched) {
            <p class="text-red-600 text-sm">E-mail invalide</p>
          }
        </div>

        <!-- Champ mot de passe -->
        <div>
          <label for="mdp" class="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" formControlName="motDePasse" class="w-full border px-3 py-2 rounded" />
          @if (form.get('motDePasse')?.invalid && form.get('motDePasse')?.touched) {
            <p class="text-red-600 text-sm">Mot de passe requis</p>
          }
        </div>

        <!-- Bouton connexion -->
        <button type="submit" [disabled]="form.invalid || chargement()"
                class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {{ chargement() ? 'Connexion…' : 'Se connecter' }}
        </button>

        <!-- Lien vers inscription -->
        <p class="text-sm text-gray-600 mt-3">
          Pas de compte ?
          <a class="text-blue-600 hover:underline" routerLink="/auth/inscription">
            Créer un compte
          </a>
        </p>

        <!-- Messages d’erreur -->
        @if (erreur()) {
          <p class="text-red-600 text-sm mt-2">{{ erreur() }}</p>
        }
      </form>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  chargement = signal(false);
  erreur = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]]
  });

  async soumettre() {
    if (this.form.invalid) return;

    this.chargement.set(true);
    this.erreur.set(null);

    try {
      this.auth.connecter({
        email: this.form.value.email!,
        motDePasse: this.form.value.motDePasse!
      });

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/accueil';
      this.router.navigateByUrl(returnUrl);

    } catch (e: unknown) {
      if (e instanceof Error) {
        this.erreur.set(e.message);
      } else {
        this.erreur.set('Erreur de connexion.');
      }
    } finally {
      this.chargement.set(false);
    }
  }
}
