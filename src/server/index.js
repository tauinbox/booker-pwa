const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const auditoriumRouter = require("./routes/auditorium.router");

const app = express();
const ROOT = process.env.DIST || '../../dist/booker-pwa';
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/auditoriums', auditoriumRouter);
app.use(express.static(ROOT));

console.log(`Serving ${ROOT}`);

app.get('*', (req, res) => {
  res.sendFile(`/`, {root: ROOT});
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
