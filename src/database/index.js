const mongoose = require('mongoose');
const env = require('../shared/environment');

mongoose.Promise = Promise;

const databaseUri = env.get('DATABASE_URI');

module.exports = {
  connect: () => {
    return mongoose.connect(databaseUri)
      .then(() => {
        console.log(`Database connected at ${databaseUri}`);
      })
      .catch((err) => {
        console.error(`Database connection error: ${err.message}`);
      });
  }
};
