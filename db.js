const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  console.error('Missing DB_URL in env');
  process.exit(1);
}

mongoose.set('strictQuery', true);
mongoose.connect(DB_URL)
  .then(() => console.log('Mongo connected'))
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

module.exports = mongoose;
