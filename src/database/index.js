const mongoose = require('mongoose');

mongoose.Promise = Promise;

const databaseUri = process.env.DATABASE_URI;

module.exports = {
  connect: () => {
    return mongoose
      .connect(databaseUri)
      .then(() => {
        console.log(`Database connected at ${databaseUri}`);
      })
      .catch((err) => {
        console.error(`Database connection error: ${err.message}`);
      });
  }
};
