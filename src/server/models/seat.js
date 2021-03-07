class Seat {
  constructor(id, userId) {
    this.id = id;
    this.userId = userId;
  }

  reassignUser(userId) {
    if (userId === this.userId) {
      this.userId = null;
      return;
    }
    if (this.userId === null) {
      this.userId = userId;
    }
  }
}

module.exports = Seat;
