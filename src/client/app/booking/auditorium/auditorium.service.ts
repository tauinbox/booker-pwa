import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { concat, EMPTY, Observable, of, Subject } from 'rxjs';
import { buffer, catchError, debounceTime, delay, expand, filter, map, switchMap } from 'rxjs/operators';
import { Auditorium } from '../models/auditorium';
import { Seat, SeatValue } from '../models/seat';
import { UserService } from '../../core/services/user.service';

const AUDITORIUM_ENDPOINT = environment.apiUrl + '/auditorium';
const DEBOUNCE_TIME = 1000;
const CONNECTION_CHECK_DELAY = 5000;

@Injectable()
export class AuditoriumService {
  public auditorium$: Observable<Auditorium>;
  private seatSelectionStream$ = new Subject<SeatValue>();

  constructor(private http: HttpClient, private userSvc: UserService) {
    this.auditorium$ = concat(this.getAuditoriumState$(), this.auditoriumStateChanges$());
  }

  public updateSelectedSeats(seatId: string): void {
    this.seatSelectionStream$.next({seatId, userId: this.userSvc.currentUserId});
  }

  private auditoriumStateChanges$(): Observable<Auditorium> {
    return this.seatSelectionStream$.pipe(
      buffer(this.seatSelectionStream$.pipe(debounceTime(DEBOUNCE_TIME))),
      map(seats => this.filterBuffer(seats)),
      filter(seats => seats.length > 0),
      switchMap(changes => this.updateAuditoriumState$(changes))
    ).pipe(switchMap(() => this.getAuditoriumState$()));
  }

  private filterBuffer(seats: SeatValue[]): SeatValue[] {
    const counter = seats.reduce(
      (count, seat) => {
        count[seat.seatId] = (count[seat.seatId] ?? 0) + 1;
        return count;
      },
      {}
    );
    const filteredIds = Object.keys(counter).filter(seatId => counter[seatId] % 2 !== 0);

    return filteredIds.map(id => seats.find(seat => seat.seatId === id));
  }

  private getAuditoriumState$(): Observable<Auditorium> {
    return this.http.get<Auditorium>(AUDITORIUM_ENDPOINT).pipe(
      map(auditorium =>
        new Auditorium(
          auditorium.seats.map(seat => new Seat(seat.seatId, seat.userId, this.userSvc.currentUserId))
        )
      )
    );
  }

  private updateAuditoriumState$(state: SeatValue[]): Observable<HttpResponse<{ 'ok': boolean }>> {
    return this.isReadyToUpdate$().pipe(
      switchMap(() => this.http.patch<HttpResponse<{ 'ok': boolean }>>(AUDITORIUM_ENDPOINT, state).pipe(
        catchError(() => this.updateAuditoriumState$(state))
      )),
    );
  }

  private isReadyToUpdate$(): Observable<boolean> {
    return this.isConnectionOk$().pipe(
      expand(ok => ok ? EMPTY : this.isConnectionOk$(CONNECTION_CHECK_DELAY)),
      filter(ok => ok)
    );
  }

  private isConnectionOk$(delayTime = 0): Observable<boolean> {
    return this.http.options(AUDITORIUM_ENDPOINT, {observe: 'response'})
      .pipe(
        map(res => res.ok),
        catchError(() => of(false)),
        delay(delayTime)
      );
  }

}
