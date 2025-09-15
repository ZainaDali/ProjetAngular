export type Role = 'patient' | 'medecin';

export interface Utilisateur {
  id: number;
  email: string;
  nom: string;
  role: Role;
}

export interface DemandeInscription {
  email: string;
  nom: string;
  motDePasse: string;
  confirmation: string;
  role: Role; // 'patient' par défaut, 'medecin' pour l’admin
}

export interface DemandeConnexion {
  email: string;
  motDePasse: string;
}
