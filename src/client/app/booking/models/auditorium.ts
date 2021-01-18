import { Seat } from './seat';

export class Auditorium {
  [seatId: string]: string;

  constructor(init: Auditorium) {
    Object.assign(this, init);
  }

  * [Symbol.iterator]?(): Generator<Seat> {
    for (const [seatId, userId] of Object.entries(this)) {
      yield {seatId, userId};
    }
  }
}
