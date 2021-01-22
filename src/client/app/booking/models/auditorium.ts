import { Seat } from './seat';

export class Auditorium implements Iterable<Seat> {
  [seatId: string]: string;

  constructor(init?: Partial<Auditorium>) {
    Object.assign(this, init ?? {});
  }

  public* [Symbol.iterator](): Generator<Seat> {
    for (const [seatId, userId] of Object.entries(this)) {
      yield new Seat(seatId, userId);
    }
  }
}
