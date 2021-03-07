const express = require('express');
const router = express.Router();
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Auditorium = require("../models/auditorium");

const db = lowDb(new FileSync('db.json'));
const auditorium1 = new Auditorium(1, 200);

db.defaults({
  auditoriums: [auditorium1]
}).write();

router.get('/:id', function (req, res) {
  const auditorium = db.get("auditoriums")
    .find({id: +req.params.id})
    .value();

  return res.json(auditorium);
});

router.patch('/:id', (req, res) => {
  const record = db.get("auditoriums")
    .find({id: +req.params.id});
  const auditorium = record.value();
  const seatChanges = req.body;

  auditorium.seats = auditorium.seats.map(seat => {
    const changedSeat = seatChanges.find(s => s.id === seat.id);
    if (changedSeat) {
      if (changedSeat.userId === seat.userId) {
        return {id: seat.id, userId: null};
      }
      return {id: seat.id, userId: changedSeat.userId};
    }
    return seat;
  });

  record
    .assign(auditorium)
    .write();

  return res.status(200).send({ok: true});
});

module.exports = router;
