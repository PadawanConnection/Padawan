var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));

app.get('/', function (req, res) {
  // res.send('Hello World!');
  res.sendFile('static/index.html', { root: __dirname });
});

app.get('/bc', function (req, res) {
	res.sendFile('static/bc.html', { root: __dirname });
})


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});