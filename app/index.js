const mongoose = require('mongoose');
const dataBaseUrl = process.env.NODE_ENV === 'development'
  ? 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb'
  : 'turbo-prod url';

mongoose.connect(dataBaseUrl, function (err) {
  if (err) throw err;

  console.log('Successfully connected');
});
