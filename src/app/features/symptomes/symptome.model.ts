// Modèle de données pour un symptôme
export interface Symptome {
  id: number;                       // identifiant unique
  patientId: number;                 // identifiant du patient
  patientNom: string;                // nom du patient (affiché côté médecin)
  date: string;                      // ISO string de la date
  description: string;               // description libre
  gravite: 'leger' | 'modere' | 'grave'; // niveau de gravité
}
