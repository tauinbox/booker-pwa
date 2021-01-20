import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuditoriumService } from './auditorium.service';
import { Auditorium } from '../models/auditorium';
import { concat, Observable, Subject } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';

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

  ngOnInit(): void {
    let selectedSeats: Auditorium = new Auditorium();
    const auditoriumInit$ = this.auditoriumService.getAuditoriumState$();
    const auditoriumUpdate$ = this.seat$.pipe(
      tap(seatId => {
        if (!selectedSeats[seatId]) {
          selectedSeats[seatId] = this.userSvc.currentUserId;
        } else if (selectedSeats[seatId] === this.userSvc.currentUserId) {
          delete selectedSeats[seatId];
        }
        this.pendingSeatIds = Object.keys(selectedSeats);
      }),
      debounceTime(1000),
      filter(() => this.pendingSeatIds.length > 0),
      switchMap(() => this.auditoriumService.updateAuditoriumState$(selectedSeats)
        .pipe(tap(() => {
          selectedSeats = new Auditorium();
          this.pendingSeatIds = [];
        }))
      )
    );

    this.auditorium$ = concat(auditoriumInit$, auditoriumUpdate$);
  }

  onSeatSelected(seatId: string): void {
    this.seat$.next(seatId);
  }

  checkConnection(): void {
    this.auditoriumService.isConnectionOk$()
      .subscribe(res => {
        console.log('Connection OK:', res);
      });
  }

}
