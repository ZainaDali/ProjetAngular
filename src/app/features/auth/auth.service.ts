import { Injectable, signal, effect } from '@angular/core';
import {
  Utilisateur,
  UtilisateurPublic,
  DemandeInscription,
  DemandeConnexion
} from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_CLE = 'medinotes.utilisateur';
  private utilisateurs: Utilisateur[] = [];

  // Signal for current user
  utilisateurCourant = signal<UtilisateurPublic | null>(null);

  constructor() {
    // Load current user from localStorage
    const brut = localStorage.getItem(this.STORAGE_CLE);
    if (brut) {
      this.utilisateurCourant.set(JSON.parse(brut));
    }

    // Default admin account (if no users exist)
    if (!this.utilisateurs.find(u => u.role === 'medecin')) {
      this.utilisateurs.push({
        id: 1,
        nom: 'Dr Admin',
        email: 'admin@medinotes.com',
        motDePasse: 'admin1234',
        role: 'medecin'
      });
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
