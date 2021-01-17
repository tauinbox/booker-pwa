import { Component, OnInit } from '@angular/core';
import { AuditoriumService } from './auditorium.service';
import { Auditorium } from '../models/auditorium';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './auditorium.component.html',
  styleUrls: ['./auditorium.component.scss'],
  providers: [AuditoriumService]
})
export class AuditoriumComponent implements OnInit {
  public auditorium$: Observable<Auditorium>;

  constructor(private auditoriumService: AuditoriumService) {
  }

  ngOnInit(): void {
    this.auditorium$ = this.auditoriumService.getAuditoriumState$();
  }

  checkConnection(): void {
    this.auditoriumService.isConnectionOk$()
      .subscribe(res => {
        console.log('Connection OK:', res);
      });
  }

}
