import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const AUDITORIUM_ENDPOINT = environment.apiUrl + '/auditorium';

@Injectable()
export class AuditoriumService {

  constructor(private http: HttpClient) {
  }

  isConnectionOk(): Observable<boolean> {
    return this.http.options(AUDITORIUM_ENDPOINT, {observe: 'response'})
      .pipe(
        map(res => res.ok),
        catchError(() => of(false))
      );
  }
}
