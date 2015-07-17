//environment setup
var express = require('express');
var    app  = express();
var    http = require('http').createServer(app);
var    io   = require('socket.io').listen(http);
var morgan  = require('morgan');
var easyrtc = require('easyrtc');

//dev midddleware -remove on deploy
app.use(morgan('dev'));

//express setup
app.use(express.static(__dirname + "./public/"));

// Start Express http server on port 3000
http.listen(3000);

// Socket.io Communication Reception 
io.sockets.on('connection', function (socket) {
  console.log(socket);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, io);