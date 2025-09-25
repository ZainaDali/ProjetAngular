import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({ providedIn: 'root' })
export class HttpErrorService {
  private notif = inject(NotificationsService);
  gererErreur(erreur: HttpErrorResponse): void {
    console.error('Erreur HTTP :', erreur.message);
    const message = erreur.error?.message || erreur.message || 'Erreur réseau';
    this.notif.erreur('Erreur API : ' + message);
  }
}
