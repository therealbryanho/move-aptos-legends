const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const cors = require("cors");
const corsOptions = require('./config/corsOptions');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(cors(corsOptions))

process.env.TZ = 'Asia/Singapore';

app.use('/api/user', require('./routes/user.route'));
app.get('/', async (req, res) => {
  return res.json({ health: "live", status: "200" })
});

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
