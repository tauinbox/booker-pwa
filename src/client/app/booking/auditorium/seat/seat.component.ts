import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Seat } from '../../models/seat';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatComponent implements OnInit {
  @Input()
  seat: Seat;

  @Input()
  currentUserId: string;

  constructor() {
  }

  ngOnInit(): void {
    console.log('seat, currentUserId:', this.seat, this.currentUserId);
  }

}
