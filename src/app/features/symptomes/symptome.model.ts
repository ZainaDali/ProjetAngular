// Data model for a symptom
export interface NoteMedecin {
  id: number;            // unique identifier for the note
  auteur: string;        // doctor's name
  date: string;          // ISO date string
  contenu: string;       // note content
}

export interface Symptome {
  id: number;                       // unique identifier
  patientId: number;                 // patient identifier
  patientNom: string;                // patient name (displayed on doctor side)
  date: string;                      // ISO date string
  description: string;               // free description
  gravite: 'leger' | 'modere' | 'grave'; // severity level
  notes?: NoteMedecin[];             // optional doctor notes
}
