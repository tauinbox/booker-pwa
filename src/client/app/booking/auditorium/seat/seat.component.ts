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

  @Input()
  public currentUserId: string;

  @Input()
  public isPending: boolean;

  @Output()
  public selected: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click')
  public onClick(): void {
    if (!this.seat.userId || this.seat.userId === this.currentUserId) {
      this.selected.emit(this.seat.seatId);
    }
  }

}
