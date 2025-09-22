export type Role = 'patient' | 'medecin';

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  motDePasse: string; // stored only on service side
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
