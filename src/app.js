const { getEnvironment } = require('./shared/environment');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

getEnvironment();

const db = require('./database');
db.connect();

const app = express();
app.set('port', process.env.PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const whitelist = process.env.ALLOW_ORIGINS.split(',');

app.use(cors({
  methods: 'POST,GET',
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.options('*', cors());

app.use('/v1', require('./routes'));

app.use(require('./middleware/404'));
app.use(require('./middleware/error-handler'));

module.exports = app;
