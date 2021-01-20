import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(public userSvc: UserService) {
  }
}
