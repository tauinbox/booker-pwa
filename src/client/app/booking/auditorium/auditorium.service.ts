import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { concat, Observable, Subject } from 'rxjs';
import { buffer, catchError, debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { Auditorium } from '../models/auditorium';
import { Seat, SeatValue } from '../models/seat';
import { UserService } from '../../core/services/user.service';
import { PollingService } from '../../core/services/polling.service';

const AUDITORIUM_ID = 1;
const AUDITORIUM_ENDPOINT = environment.apiUrl + '/auditoriums/' + AUDITORIUM_ID;
const DEBOUNCE_TIME = 1000;

@Injectable()
export class AuditoriumService {
  public auditorium$: Observable<Auditorium>;
  private seatSelectionStream$ = new Subject<SeatValue>();

  constructor(private http: HttpClient,
              private polling: PollingService,
              private userSvc: UserService) {
    this.auditorium$ = concat(this.getAuditoriumState$(), this.auditoriumStateChanges$());
  }

  public updateSelectedSeats(id: number): void {
    this.seatSelectionStream$.next({id, userId: this.userSvc.currentUserId});
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
        count[seat.id] = (count[seat.id] ?? 0) + 1;
        return count;
      },
      {}
    );
    const filteredIds = Object.keys(counter).filter(id => counter[id] % 2 !== 0);

    return filteredIds.map(id => seats.find(seat => String(seat.id) === id));
  }

  private getAuditoriumState$(): Observable<Auditorium> {
    return this.http.get<Auditorium>(AUDITORIUM_ENDPOINT).pipe(
      map(auditorium =>
        new Auditorium(AUDITORIUM_ID, auditorium.seats.map(seat => new Seat(seat.id, seat.userId, this.userSvc.currentUserId))
        )
      )
    );
  }

  private updateAuditoriumState$(state: SeatValue[]): Observable<HttpResponse<{ 'ok': boolean }>> {
    return this.polling.isReadyToUpdate$(AUDITORIUM_ENDPOINT).pipe(
      switchMap(() => this.http.patch<HttpResponse<{ 'ok': boolean }>>(AUDITORIUM_ENDPOINT, state).pipe(
        catchError(() => this.updateAuditoriumState$(state))
      )),
    );
  }

}
