import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuditoriumService } from './auditorium.service';
import { Auditorium } from '../models/auditorium';
import { Observable } from 'rxjs';
import { Seat } from '../models/seat';

@Component({
  templateUrl: './auditorium.component.html',
  styleUrls: ['./auditorium.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuditoriumService]
})
export class AuditoriumComponent implements OnInit {
  public auditorium$: Observable<Auditorium>;

  constructor(private auditoriumService: AuditoriumService) {
  }

  public ngOnInit(): void {
    this.auditorium$ = this.auditoriumService.auditorium$;
  }

  public onSeatSelected(seatId: number): void {
    this.auditoriumService.updateSelectedSeats(seatId);
  }

  public trackBy(index: number, item: Seat): string {
    return item.userId;
  }

}
