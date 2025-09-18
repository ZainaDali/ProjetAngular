import { Injectable, signal } from '@angular/core';

export type TypeNotif = 'info' | 'succes' | 'erreur';
export interface Notification {
  id: number;
  type: TypeNotif;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  liste = signal<Notification[]>([]);

  push(type: TypeNotif, message: string, autoCloseMs = 3000) {
    const n: Notification = { id: Date.now(), type, message };
    this.liste.update(list => [n, ...list]);
    if (autoCloseMs > 0) {
      setTimeout(() => this.remove(n.id), autoCloseMs);
    }
  }

  remove(id: number) {
    this.liste.update(list => list.filter(n => n.id !== id));
  }

  info(msg: string)   { this.push('info', msg); }
  succes(msg: string) { this.push('succes', msg); }
  erreur(msg: string) { this.push('erreur', msg); }
}
