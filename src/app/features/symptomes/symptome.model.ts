// Data model for a symptom
export interface Symptome {
  id: number;                       // unique identifier
  patientId: number;                 // patient identifier
  patientNom: string;                // patient name (displayed on doctor side)
  date: string;                      // ISO date string
  description: string;               // free description
  gravite: 'leger' | 'modere' | 'grave'; // severity level
}
