const express = require('express');
const router = express.Router();
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Seat = require("../models/seat");

const defaultSeats = Array.from(Array(200).keys())
  .map(k => new Seat(String(k + 1), null));
const db = lowDb(new FileSync('db.json'));

db.defaults({auditorium: {seats: defaultSeats}}).write();

router.get('/', function(req, res) {
  const auditorium = db.get("auditorium").value();
  return res.json(auditorium);
});

router.patch('/', (req, res) => {
  const auditorium = db.get("auditorium").value();
  const seatChanges = req.body;

  auditorium.seats = auditorium.seats.map(seat => {
    const changedSeat = seatChanges.find(s => s.seatId === seat.seatId);
    if (changedSeat) {
      if (changedSeat.userId === seat.userId) {
        return {seatId: seat.seatId, userId: null};
      }
      return {seatId: seat.seatId, userId: changedSeat.userId};
    }
    return seat;
  });

  db.set('auditorium', auditorium).write();
  return res.status(200).send({ok: true});
});

module.exports = router;
