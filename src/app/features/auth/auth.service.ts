import { Injectable, signal, effect } from '@angular/core';
import {
  Utilisateur,
  UtilisateurPublic,
  DemandeInscription,
  DemandeConnexion,
  Role
} from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_CLE = 'medinotes.utilisateur';
  private utilisateurs: Utilisateur[] = [];

  // Signal pour l’utilisateur courant
  utilisateurCourant = signal<UtilisateurPublic | null>(null);

  constructor() {
    // Charger utilisateur courant depuis localStorage
    const brut = localStorage.getItem(this.STORAGE_CLE);
    if (brut) {
      this.utilisateurCourant.set(JSON.parse(brut));
    }

    // 👉 Compte admin par défaut (si aucun utilisateur n’existe)
    if (!this.utilisateurs.find(u => u.role === 'medecin')) {
      this.utilisateurs.push({
        id: 1,
        nom: 'Dr Admin',
        email: 'admin@medinotes.com',
        motDePasse: 'admin1234',
        role: 'medecin'
      });
    }

    // ✅ Effect : persistance automatique de la session
    effect(() => {
      const user = this.utilisateurCourant();
      if (user) {
        localStorage.setItem(this.STORAGE_CLE, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.STORAGE_CLE);
      }
    });
  }

  /** Inscription d’un utilisateur (patient ou médecin) */
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

  /** Connexion d’un utilisateur existant */
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

  /** Déconnexion */
  deconnecter() {
    this.utilisateurCourant.set(null);
  }

  /** Vérifie si l’utilisateur est connecté */
  estConnecte(): boolean {
    return this.utilisateurCourant() !== null;
  }

  /** Vérifie si l’utilisateur est médecin/admin */
  estMedecin(): boolean {
    return this.utilisateurCourant()?.role === 'medecin';
  }
}
