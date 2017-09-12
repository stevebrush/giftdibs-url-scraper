const { getEnvironment } = require('./shared/environment');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

getEnvironment();

const app = express();
app.set('port', process.env.PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,OPTIONS'
}));

app.use('/v1', require('./routes'));

app.use(require('./middleware/404'));
app.use(require('./middleware/error-handler'));

module.exports = app;
