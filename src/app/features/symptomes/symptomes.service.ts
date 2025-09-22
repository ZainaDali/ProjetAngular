import { Injectable, signal } from '@angular/core';
import { Symptome } from './symptome.model';

@Injectable({ providedIn: 'root' })
export class SymptomesService {
  private readonly STORAGE_KEY = 'medinotes.symptomes';

  // Global signal to store all symptoms
  symptomes = signal<Symptome[]>([]);

  constructor() {
    // Load from localStorage on startup
    const brut = localStorage.getItem(this.STORAGE_KEY);
    if (brut) {
      this.symptomes.set(JSON.parse(brut));
    }
  }

  /** Add a symptom */
  ajouter(symptome: Symptome) {
    const maj = [...this.symptomes(), symptome];
    this.symptomes.set(maj);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(maj));
  }

  /** Delete a symptom */
  supprimer(id: number) {
    const maj = this.symptomes().filter((s: Symptome) => s.id !== id);
    this.symptomes.set(maj);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(maj));
  }

  /** Modify an existing symptom */
  modifier(
    id: number,
    maj: { description: string; gravite: 'leger' | 'modere' | 'grave' }
  ) {
    const symptomes = this.symptomes();
    const index = symptomes.findIndex((s: Symptome) => s.id === id);
    if (index !== -1) {
      symptomes[index] = { ...symptomes[index], ...maj };
      this.symptomes.set([...symptomes]);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(symptomes));
    }
  }

  /** Get only symptoms for a specific patient */
  getByPatient(patientId: number) {
    return this.symptomes().filter((s: Symptome) => s.patientId === patientId);
  }
}
