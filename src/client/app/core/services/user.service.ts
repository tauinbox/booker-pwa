import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUserId = 100;

  constructor() {
  }
}
