const express = require('express');
const router = express.Router();
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Auditorium = require("../models/auditorium");
const Seat = require("../models/seat");

const db = lowDb(new FileSync('db.json'));
const auditorium1 = new Auditorium(1, Array.from(Array(200).keys()).map(k => new Seat(k + 1, null)));

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
  const auditorium = new Auditorium(+req.params.id, record.value().seats.map(seat => new Seat(seat.id, seat.userId)));
  const updatedSeats = req.body || [];

  updatedSeats.forEach(seat => auditorium.getSeat(seat.id).reassignUser(seat.userId));

  record
    .assign(auditorium)
    .write();

  return res.status(200).send({ok: true});
});

module.exports = router;
