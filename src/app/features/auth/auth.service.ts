import { Injectable, signal } from '@angular/core';
import { Utilisateur, DemandeConnexion, DemandeInscription, Role } from './models';

/**
 * Service d'authentification "mock" :
 * - stocke les utilisateurs en mémoire (et localStorage pour persistance)
 * - expose un signal utilisateurCourant pour les composants/guards
 * - méthodes: inscrire, connecter, deconnecter
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_CLE = 'medinotes.utilisateur';
  private readonly STORAGE_UTILS = 'medinotes.utilisateurs';

  // Utilisateur actuellement connecté (signal = réactif, simple et moderne)
  utilisateurCourant = signal<Utilisateur | null>(null);

  // "Base" utilisateurs en mémoire (mock)
  private utilisateurs: Array<Utilisateur & { motDePasse: string }> = [
    // Compte médecin par défaut pour accéder à l’admin
    { id: 1, email: 'medecin@medinotes.fr', nom: 'Dr. Martin', role: 'medecin', motDePasse: 'Azerty123!' }
  ];

  constructor() {
    // Hydrate depuis le localStorage si présent
    const brut = localStorage.getItem(this.STORAGE_CLE);
    if (brut) this.utilisateurCourant.set(JSON.parse(brut));

    const brutUsers = localStorage.getItem(this.STORAGE_UTILS);
    if (brutUsers) this.utilisateurs = JSON.parse(brutUsers);
  }

  /** Inscription simple : ajoute un utilisateur (patient par défaut) */
  inscrire(payload: DemandeInscription): Utilisateur {
    const existe = this.utilisateurs.find(u => u.email === payload.email);
    if (existe) throw new Error('Un utilisateur avec cet e-mail existe déjà.');

    const role: Role = payload.role ?? 'patient';
    const nouvelId = this.utilisateurs.length ? Math.max(...this.utilisateurs.map(u => u.id)) + 1 : 1;

    const u: Utilisateur & { motDePasse: string } = {
      id: nouvelId,
      email: payload.email.trim().toLowerCase(),
      nom: payload.nom.trim(),
      role,
      motDePasse: payload.motDePasse
    };

    this.utilisateurs.push(u);
    localStorage.setItem(this.STORAGE_UTILS, JSON.stringify(this.utilisateurs));

    // Retourne l’utilisateur sans le mot de passe
    const { motDePasse, ...publicUser } = u;
    return publicUser;
  }

  /** Connexion : vérifie email + mot de passe */
  connecter(payload: DemandeConnexion): Utilisateur {
    const email = payload.email.trim().toLowerCase();
    const user = this.utilisateurs.find(u => u.email === email && u.motDePasse === payload.motDePasse);
    if (!user) throw new Error('Identifiants invalides.');

    const { motDePasse, ...publicUser } = user;
    this.utilisateurCourant.set(publicUser);
    localStorage.setItem(this.STORAGE_CLE, JSON.stringify(publicUser));
    return publicUser;
  }

  /** Déconnexion */
  deconnecter(): void {
    this.utilisateurCourant.set(null);
    localStorage.removeItem(this.STORAGE_CLE);
  }

  /** Outil pratique pour les guards */
  estConnecte(): boolean {
    return !!this.utilisateurCourant();
  }

  estMedecin(): boolean {
    return this.utilisateurCourant()?.role === 'medecin';
  }
}
