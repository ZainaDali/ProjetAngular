import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, delay, throwError } from 'rxjs';
import { HttpErrorService } from '../services/http-error.service';

// Functional interceptor (Angular 15+)
export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const erreurService = inject(HttpErrorService) as HttpErrorService;


  return next(req).pipe(
    delay(500), // simulates network delay
    catchError((error: HttpErrorResponse) => {
      erreurService.gererErreur(error);
      return throwError(() => error);
    })
  );
};
