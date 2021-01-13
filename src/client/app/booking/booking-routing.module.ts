import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditoriumComponent } from './auditorium/auditorium.component';

const ROUTES: Routes = [
  {path: '', component: AuditoriumComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class BookingRoutingModule {
}
