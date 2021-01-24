import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuditoriumService } from './auditorium.service';
import { Auditorium } from '../models/auditorium';
import { concat, EMPTY, Observable, of, Subject } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { catchError, debounceTime, expand, filter, switchMap, tap } from 'rxjs/operators';

const DEBOUNCE_TIME = 1000;
const CONNECTION_CHECK_DELAY = 5000;

@Component({
  templateUrl: './auditorium.component.html',
  styleUrls: ['./auditorium.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuditoriumService]
})
export class AuditoriumComponent implements OnInit {
  public pendingSeatIds: string[] = [];
  public auditorium$: Observable<Auditorium>;

  private seat$: Subject<string> = new Subject<string>();

  constructor(private auditoriumService: AuditoriumService, public userSvc: UserService) {
  }

  public ngOnInit(): void {
    const auditoriumInit$ = this.auditoriumService.getAuditoriumState$();
    const auditoriumUpdate$ = this.seat$.pipe(
      tap(seatId => this.updateSelectedSeats(seatId)),
      debounceTime(DEBOUNCE_TIME),
      filter(() => this.pendingSeatIds.length > 0),
      switchMap(() => this.updateAuditoriumState$())
    );

    this.auditorium$ = concat(auditoriumInit$, auditoriumUpdate$);
  }

  public onSeatSelected(seatId: string): void {
    this.seat$.next(seatId);
  }

  private updateSelectedSeats(seatId: string): void {
    this.auditoriumService.updateSelectedSeats(seatId, this.userSvc.currentUserId);
    this.pendingSeatIds = this.auditoriumService.getPendingSeatIds();
  }

  private updateAuditoriumState$(): Observable<Auditorium> {
    return this.isReadyToUpdate$().pipe(
      switchMap(() => this.auditoriumService.updateAuditoriumState$(this.auditoriumService.selectedSeats)
        .pipe(
          tap(() => this.resetSelectedSeats()),
          catchError(() => this.updateAuditoriumState$())
        ).pipe(switchMap(() => this.auditoriumService.getAuditoriumState$())))
    );
  }

  private resetSelectedSeats(): void {
    this.auditoriumService.resetSelectedSeats();
    this.pendingSeatIds = [];
  }

  private isReadyToUpdate$(): Observable<boolean> {
    return of(this.pendingSeatIds.length > 0).pipe(
      filter(ok => ok),
      switchMap(() => this.auditoriumService.isConnectionOk$().pipe(
        expand(ok => ok || this.pendingSeatIds.length === 0 ? EMPTY : this.auditoriumService.isConnectionOk$(CONNECTION_CHECK_DELAY)),
        filter(ok => ok)
      ))
    );
  }

}
