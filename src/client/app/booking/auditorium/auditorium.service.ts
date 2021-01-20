import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Auditorium } from '../models/auditorium';

const AUDITORIUM_ENDPOINT = environment.apiUrl + '/auditorium';

function initAuditorium(numberOfSeats: number = 1): Auditorium {
  const auditorium: Auditorium = new Auditorium();
  for (let i = 1; i <= numberOfSeats; i++) {
    auditorium[i] = null;
  }
  return auditorium;
}

@Injectable()
export class AuditoriumService {
  private emptyAuditorium: Auditorium = initAuditorium(200);

  constructor(private http: HttpClient) {
  }

  isConnectionOk$(): Observable<boolean> {
    return this.http.options(AUDITORIUM_ENDPOINT, {observe: 'response'})
      .pipe(
        map(res => res.ok),
        catchError(() => of(false))
      );
  }

  getAuditoriumState$(): Observable<Auditorium> {
    return this.http.get<Auditorium>(AUDITORIUM_ENDPOINT).pipe(
      map(auditorium => new Auditorium({...this.emptyAuditorium, ...auditorium}))
    );
  }

  updateAuditoriumState$(state: Auditorium): Observable<Auditorium> {
    return this.http.patch<Auditorium>(AUDITORIUM_ENDPOINT, state).pipe(
      map(auditorium => new Auditorium({...this.emptyAuditorium, ...auditorium}))
    );
  }
}
