import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { HomeComponent } from './core/home/home.component';

const ROUTES: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'booking', loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule)},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
