import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestApiService {
  private http = inject(HttpClient); 

  getErreur(): Observable<unknown> {
    return this.http.get('https://jsonplaceholder.typicode.com/404');
  }
}
