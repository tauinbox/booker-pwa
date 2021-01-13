import { Component, OnInit } from '@angular/core';
import { AuditoriumService } from './auditorium.service';

@Component({
  templateUrl: './auditorium.component.html',
  styleUrls: ['./auditorium.component.css'],
  providers: [AuditoriumService]
})
export class AuditoriumComponent implements OnInit {

  constructor(private auditoriumService: AuditoriumService) {
  }

  ngOnInit(): void {
  }

  checkConnection(): void {
    this.auditoriumService.isConnectionOk()
      .subscribe(res => {
        console.log('Connection OK:', res);
      });
  }

}
