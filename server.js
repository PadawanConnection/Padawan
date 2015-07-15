var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server Running at http://%s:%s Message of Sprint Day 2: Hold on to your butts -Jurassic Park', host, port);
});