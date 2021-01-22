export class Seat {
  constructor(public seatId: string, public userId: string) {
  }

  public [Symbol.toPrimitive](): string {
    return this.seatId;
  }
}
