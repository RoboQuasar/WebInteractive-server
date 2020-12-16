const express = require('express');

require('./app');

const app = express();
const port = process.env.PORT || 3000;

console.log('process.env: ', process.env);

app.listen(port, function (err) {
  if (err) throw err;

  console.log(`server is listening on ${port}...`);
});
