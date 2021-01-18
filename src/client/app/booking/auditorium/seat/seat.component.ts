import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
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

  @Output()
  selected: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
    console.log('seat, currentUserId:', this.seat, this.currentUserId);
  }

  @HostListener('click', ['$event.target'])
  onClick(): void {
    if (!this.seat.userId || this.seat.userId === this.currentUserId) {
      this.selected.emit(this.seat.seatId);
    }
  }

}
