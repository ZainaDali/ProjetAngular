import { Injectable, signal } from '@angular/core';
import { Symptome } from './symptome.model';

@Injectable({ providedIn: 'root' })
export class SymptomesService {
  private readonly STORAGE_KEY = 'medinotes.symptomes';

  symptomes = signal<Symptome[]>([]);

  constructor() {
    const brut = localStorage.getItem(this.STORAGE_KEY);
    if (brut) this.symptomes.set(JSON.parse(brut));
  }

  ajouter(symptome: Symptome) {
    const actuels = this.symptomes();
    const maj = [...actuels, symptome];
    this.symptomes.set(maj);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(maj));
  }

  supprimer(id: number) {
    const maj = this.symptomes().filter(s => s.id !== id);
    this.symptomes.set(maj);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(maj));
  }

  // Récupérer seulement les symptômes d’un patient
  getByPatient(patientId: number) {
    return this.symptomes().filter(s => s.patientId === patientId);
  }
}
