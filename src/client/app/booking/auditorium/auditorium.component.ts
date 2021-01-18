import { Component, OnInit } from '@angular/core';
import { AuditoriumService } from './auditorium.service';
import { Auditorium } from '../models/auditorium';
import { concat, Observable, Subject } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './auditorium.component.html',
  styleUrls: ['./auditorium.component.scss'],
  providers: [AuditoriumService]
})
export class AuditoriumComponent implements OnInit {
  public auditorium$: Observable<Auditorium>;
  private updateAuditoriumState$: Subject<string> = new Subject<string>();

  constructor(private auditoriumService: AuditoriumService, public userSvc: UserService) {
  }

  ngOnInit(): void {
    this.auditorium$ = concat(
      this.auditoriumService.getAuditoriumState$(),
      this.updateAuditoriumState$.pipe(
        filter(seatId => !!seatId),
        switchMap(seatId => this.auditoriumService.updateAuditoriumState$({[seatId]: this.userSvc.currentUserId}))
      )
    );
  }

  trackByFn(index: number): number {
    return index;
  }

  onSeatSelected(seatId: string): void {
    this.updateAuditoriumState$.next(seatId);
  }

  checkConnection(): void {
    this.auditoriumService.isConnectionOk$()
      .subscribe(res => {
        console.log('Connection OK:', res);
      });
  }

}
