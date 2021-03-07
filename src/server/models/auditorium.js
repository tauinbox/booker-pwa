class Auditorium {
  id;
  seats;

  constructor(id, seats) {
    this.id = id;
    this.seats = seats;
  }

  getSeat(seatId) {
    return this.seats.find(seat => seat.id === seatId);
  }

}

module.exports = Auditorium;
