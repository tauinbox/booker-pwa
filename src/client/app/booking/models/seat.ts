export type SeatValue = Pick<Seat, 'id' | 'userId'>;

export class Seat {
  public isOccupied: boolean;
  public isReserved: boolean;
  public isPending: boolean;

  constructor(public id: number, public userId: string, currentUserId: string) {
    this.isReserved = this.userId === currentUserId;
    this.isOccupied = Boolean(this.userId) && !this.isReserved;
    this.isPending = false;
  }

  public select(): void {
    this.isPending = !this.isPending;
  }

  public [Symbol.toPrimitive](): number {
    return this.id;
  }
}
