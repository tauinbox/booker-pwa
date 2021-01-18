import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public userSvc: UserService) {
  }

  ngOnInit(): void {
  }

}
