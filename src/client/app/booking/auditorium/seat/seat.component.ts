import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Seat } from '../../models/seat';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatComponent {
  @Input()
  public seat: Seat;

  @Output()
  public selected: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click')
  public onClick(): void {
    if (!this.seat.isOccupied) {
      this.seat.select();
      this.selected.emit(this.seat.seatId);
    }
  }

}
