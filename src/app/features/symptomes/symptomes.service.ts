import { Injectable, inject, signal } from '@angular/core';
import { Symptome, NoteMedecin } from './symptome.model';
import { PatientNotificationsService } from '../../core/services/patient-notifications.service';

@Injectable({ providedIn: 'root' })
export class SymptomesService {
  private readonly STORAGE_KEY = 'medinotes.symptomes';
  private patientNotif = inject(PatientNotificationsService);

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

  /** Append a doctor note to a symptom */
  ajouterNote(symptomeId: number, note: Omit<NoteMedecin, 'id' | 'date'> & { contenu: string }): NoteMedecin | null {
    const symptomes = this.symptomes();
    const index = symptomes.findIndex(s => s.id === symptomeId);
    if (index === -1) return null;

    const nouvelleNote: NoteMedecin = {
      id: Date.now(),
      auteur: note.auteur,
      date: new Date().toISOString(),
      contenu: note.contenu
    };

    const notes = symptomes[index].notes ? [...symptomes[index].notes, nouvelleNote] : [nouvelleNote];
    symptomes[index] = { ...symptomes[index], notes };
    this.symptomes.set([...symptomes]);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(symptomes));

    // Emit patient-facing event
    this.patientNotif.push({
      patientId: symptomes[index].patientId,
      type: 'note-ajoutee',
      message: `Une note a été ajoutée par ${nouvelleNote.auteur} sur votre symptôme du ${new Date(symptomes[index].date).toLocaleString()}`
    });
    return nouvelleNote;
  }

  /** Edit a doctor note of a symptom */
  modifierNote(symptomeId: number, noteId: number, contenu: string): boolean {
    const symptomes = this.symptomes();
    const sIdx = symptomes.findIndex(s => s.id === symptomeId);
    if (sIdx === -1) return false;
    const s = symptomes[sIdx];
    const notes = s.notes ?? [];
    const nIdx = notes.findIndex(n => n.id === noteId);
    if (nIdx === -1) return false;
    const majNotes = [...notes];
    majNotes[nIdx] = { ...majNotes[nIdx], contenu };
    symptomes[sIdx] = { ...s, notes: majNotes };
    this.symptomes.set([...symptomes]);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(symptomes));
    return true;
  }

  /** Delete a doctor note from a symptom */
  supprimerNote(symptomeId: number, noteId: number): boolean {
    const symptomes = this.symptomes();
    const sIdx = symptomes.findIndex(s => s.id === symptomeId);
    if (sIdx === -1) return false;
    const s = symptomes[sIdx];
    const notes = s.notes ?? [];
    const majNotes = notes.filter(n => n.id !== noteId);
    symptomes[sIdx] = { ...s, notes: majNotes };
    this.symptomes.set([...symptomes]);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(symptomes));
    return true;
  }

  /** Get only symptoms for a specific patient */
  getByPatient(patientId: number) {
    return this.symptomes().filter((s: Symptome) => s.patientId === patientId);
  }
}
