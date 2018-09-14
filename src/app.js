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

app.use(cors({
  methods: 'POST,GET',
  origin: process.env.ALLOW_ORIGIN
}));
app.options('*', cors());

app.use('/v1', require('./routes'));

app.use(require('./middleware/404'));
app.use(require('./middleware/error-handler'));

module.exports = app;
