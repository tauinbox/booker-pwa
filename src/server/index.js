const express = require("express");
const cors = require("cors");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bodyParser = require("body-parser");

const db = lowDb(new FileSync('db.json'));
db.defaults({auditorium: {}}).write();

const app = express();
const ROOT = process.env.DIST || '../../dist/booker-pwa';
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/auditorium', (req, res) => {
  const auditorium = db.get("auditorium").value();
  return res.json(auditorium);
});

app.patch('/auditorium', (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send('Bad Request');
  }

  let auditorium = db.get('auditorium').value();

  Object.entries(req.body).forEach(([seatId, userId]) => {
    if (auditorium[seatId] && auditorium[seatId] !== userId) {
      return;
    }

    if (!auditorium[seatId]) {
      auditorium[seatId] = userId;
    } else if (auditorium[seatId] === userId) {
      delete auditorium[seatId]
    }
  });

  db.set('auditorium', auditorium).write();
  res.json({auditorium});
});

app.use(express.static(ROOT));
console.log(`Serving ${ROOT}`);

app.get('*', (req, res) => {
  res.sendFile(`/`, {root: ROOT});
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
