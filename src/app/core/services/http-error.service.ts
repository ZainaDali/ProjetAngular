import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpErrorService {
  gererErreur(erreur: HttpErrorResponse): void {
    console.error('Erreur HTTP :', erreur.message);
    alert('Erreur API : ' + erreur.message);
  }
}
