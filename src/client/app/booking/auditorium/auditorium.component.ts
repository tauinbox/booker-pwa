import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuditoriumService } from './auditorium.service';
import { Auditorium } from '../models/auditorium';
import { concat, EMPTY, Observable, Subject } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { catchError, debounceTime, expand, filter, switchMap, tap } from 'rxjs/operators';

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
      tap(seatId => {
        this.auditoriumService.updateSelectedSeats(seatId, this.userSvc.currentUserId);
        this.pendingSeatIds = Object.keys(this.auditoriumService.selectedSeats);
      }),
      debounceTime(1000),
      filter(() => this.pendingSeatIds.length > 0),
      switchMap(() => this.updateAuditoriumState$())
    );

    this.auditorium$ = concat(auditoriumInit$, auditoriumUpdate$);
  }

  public onSeatSelected(seatId: string): void {
    this.seat$.next(seatId);
  }

  private updateAuditoriumState$(): Observable<Auditorium> {
    return this.auditoriumService.updateAuditoriumState$(this.auditoriumService.selectedSeats)
      .pipe(
        tap(() => this.resetSelectedSeats()),
        catchError(() => this.handleUpdateError())
      );
  }

  private resetSelectedSeats(): void {
    this.auditoriumService.resetSelectedSeats();
    this.pendingSeatIds = [];
  }

  private handleUpdateError(): Observable<Auditorium> {
    return this.auditoriumService.isConnectionOk$().pipe(
      expand(ok => ok ? EMPTY : this.auditoriumService.isConnectionOk$(5000)),
      filter(ok => ok),
      switchMap(() => this.updateAuditoriumState$())
    );
  }

}
