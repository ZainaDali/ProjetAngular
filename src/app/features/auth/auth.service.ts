import { Injectable, signal, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Utilisateur,
  UtilisateurPublic,
  DemandeInscription,
  DemandeConnexion
} from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_CLE = 'medinotes.utilisateur';
  private readonly USERS_STORAGE_KEY = 'medinotes.utilisateurs';
  private utilisateurs: Utilisateur[] = [];

  // Signal for current user
  utilisateurCourant = signal<UtilisateurPublic | null>(null);
  // Router injected as a class property for navigation
  private router = inject(Router);

  constructor() {
    
    const brut = localStorage.getItem(this.STORAGE_CLE);
    if (brut) {
      this.utilisateurCourant.set(JSON.parse(brut));
    }

    // Load users from localStorage (and seed default admin if empty)
    const savedUsers = localStorage.getItem(this.USERS_STORAGE_KEY);
    if (savedUsers) {
      try {
        this.utilisateurs = JSON.parse(savedUsers) as Utilisateur[];
      } catch {
        this.utilisateurs = [];
      }
    }

    if (this.utilisateurs.length === 0) {
      this.utilisateurs.push({
        id: 1,
        nom: 'Dr Admin',
        email: 'admin@medinotes.com',
        motDePasse: 'admin1234',
        role: 'medecin'
      });
      localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.utilisateurs));
    }

    // Effect: automatic session persistence
    effect(() => {
      const user = this.utilisateurCourant();
      if (user) {
        localStorage.setItem(this.STORAGE_CLE, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.STORAGE_CLE);
      }
    });
  }

  /** Register a user (patient or doctor) */
  inscrire(demande: DemandeInscription): UtilisateurPublic {
    if (demande.motDePasse !== demande.confirmation) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    const existe = this.utilisateurs.find(u => u.email === demande.email);
    if (existe) {
      throw new Error('Un compte existe déjà avec cet email');
    }

    const nouvelUtilisateur: Utilisateur = {
      id: Date.now(),
      nom: demande.nom,
      email: demande.email,
      motDePasse: demande.motDePasse,
      role: demande.role ?? 'patient'
    };

    this.utilisateurs.push(nouvelUtilisateur);
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.utilisateurs));

    const publicUser: UtilisateurPublic = {
      id: nouvelUtilisateur.id,
      nom: nouvelUtilisateur.nom,
      email: nouvelUtilisateur.email,
      role: nouvelUtilisateur.role
    };

    this.utilisateurCourant.set(publicUser);
    return publicUser;
  }

  /** Login for existing user */
  connecter(demande: DemandeConnexion): UtilisateurPublic {
    const user = this.utilisateurs.find(
      u => u.email === demande.email && u.motDePasse === demande.motDePasse
    );

    if (!user) {
      throw new Error('Identifiants invalides');
    }

    const publicUser: UtilisateurPublic = {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role
    };

    this.utilisateurCourant.set(publicUser);
    return publicUser;
  }

  /** Logout */
  deconnecter() {
    this.utilisateurCourant.set(null);
    // Redirect to login page after logout
    
    this.router.navigate(['/auth/connexion'], { replaceUrl: true });
  }

  /** Check if user is logged in */
  estConnecte(): boolean {
    return this.utilisateurCourant() !== null;
  }

  /** Check if user is doctor/admin */
  estMedecin(): boolean {
    return this.utilisateurCourant()?.role === 'medecin';
  }
}
