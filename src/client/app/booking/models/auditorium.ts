import { Seat } from './seat';

export class Auditorium {
  constructor(public id: number, public seats: Seat[]) {
  }
}
