import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, map, mergeMap } from 'rxjs/operators';
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
  public selectedSeats: Auditorium = new Auditorium();
  private emptyAuditorium: Auditorium = initAuditorium(200);

  constructor(private http: HttpClient) {
  }

  public updateSelectedSeats(seatId: string, userId: string): void {
    if (!this.selectedSeats[seatId]) {
      this.selectedSeats[seatId] = userId;
    } else if (this.selectedSeats[seatId] === userId) {
      delete this.selectedSeats[seatId];
    }
  }

  public resetSelectedSeats(): void {
    this.selectedSeats = new Auditorium();
  }

  public isConnectionOk$(delayTime = 0): Observable<boolean> {
    return of(EMPTY).pipe(
      delay(delayTime),
      mergeMap(() => this.http.options(AUDITORIUM_ENDPOINT, {observe: 'response'})
        .pipe(
          map(res => res.ok),
          catchError(() => of(false))
        ))
    );
  }

  public getAuditoriumState$(): Observable<Auditorium> {
    return this.http.get<Auditorium>(AUDITORIUM_ENDPOINT).pipe(
      map(auditorium => new Auditorium({...this.emptyAuditorium, ...auditorium}))
    );
  }

  public updateAuditoriumState$(state: Auditorium): Observable<Auditorium> {
    return this.http.patch<Auditorium>(AUDITORIUM_ENDPOINT, state).pipe(
      map(auditorium => new Auditorium({...this.emptyAuditorium, ...auditorium}))
    );
  }
}
