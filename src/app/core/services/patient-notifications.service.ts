import { Injectable, signal } from '@angular/core';

export interface PatientEvent {
  id: number;
  patientId: number;
  type: 'note-ajoutee';
  message: string;
  date: string;
  lu: boolean;
}

@Injectable({ providedIn: 'root' })
export class PatientNotificationsService {
  private readonly STORAGE_KEY = 'medinotes.patient.events';
  events = signal<PatientEvent[]>(this.load());

  private load(): PatientEvent[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PatientEvent[]) : [];
    } catch {
      return [];
    }
  }

  private persist() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events()));
  }

  push(event: Omit<PatientEvent, 'id' | 'date' | 'lu'>) {
    const e: PatientEvent = {
      id: Date.now(),
      date: new Date().toISOString(),
      lu: false,
      ...event,
    };
    this.events.update(list => [e, ...list]);
    this.persist();
  }

  nonLusPour(patientId: number) {
    return this.events().filter(e => e.patientId === patientId && !e.lu);
  }

  marquerCommeLus(patientId: number) {
    const maj = this.events().map(e => e.patientId === patientId ? { ...e, lu: true } : e);
    this.events.set(maj);
    this.persist();
  }
}


