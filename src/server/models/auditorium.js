const Seat = require("./seat");

class Auditorium {
  id;
  seats;

  constructor(id, numberOfSeats) {
    this.id = id;
    this.seats = this.initSeats(numberOfSeats);
  }

  initSeats(numberOfSeats) {
    return Array.from(Array(numberOfSeats).keys()).map(k => new Seat(k + 1, null));
  }

}

module.exports = Auditorium;
