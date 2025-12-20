const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection successful'))
  .catch((err) => {
    console.error(`Database connection error:${err}`,);
    process.exit(1);
  });
};