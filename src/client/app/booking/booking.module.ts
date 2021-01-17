import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriumComponent } from './auditorium/auditorium.component';
import { BookingRoutingModule } from './booking-routing.module';
import { SeatComponent } from './auditorium/seat/seat.component';

@NgModule({
  declarations: [
    AuditoriumComponent,
    SeatComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ],
  exports: [
    AuditoriumComponent
  ]
})
export class BookingModule {
}
