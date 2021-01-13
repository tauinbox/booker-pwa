import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriumComponent } from './auditorium/auditorium.component';
import { BookingRoutingModule } from './booking-routing.module';

@NgModule({
  declarations: [
    AuditoriumComponent
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
