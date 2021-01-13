import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriumComponent } from './auditorium/auditorium.component';

@NgModule({
  declarations: [
    AuditoriumComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AuditoriumComponent
  ]
})
export class BookingModule {
}
