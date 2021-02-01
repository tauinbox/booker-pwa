export type SeatValue = Pick<Seat, 'seatId' | 'userId'>;

export class Seat {
  public isOccupied: boolean;
  public isReserved: boolean;
  public isPending: boolean;

  constructor(public seatId: string, public userId: string, currentUserId: string) {
    this.isReserved = this.userId === currentUserId;
    this.isOccupied = Boolean(this.userId) && !this.isReserved;
    this.isPending = false;
  }

  public select(): void {
    this.isPending = !this.isPending;
  }

  public [Symbol.toPrimitive](): string {
    return this.seatId;
  }
}
