export type Role = 'patient' | 'medecin';

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  motDePasse: string; // stocké seulement côté service
  role: Role;
}

export interface UtilisateurPublic {
  id: number;
  nom: string;
  email: string;
  role: Role;
}

export interface DemandeInscription {
  email: string;
  nom: string;
  motDePasse: string;
  confirmation: string;
  role?: Role;
}

export interface DemandeConnexion {
  email: string;
  motDePasse: string;
}
