/// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module
var morgan  = require("morgan");
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/public/"));
httpApp.use(morgan('tiny'));

// Start Express http server on port 3000
var webServer = http.createServer(httpApp).listen(3000);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer);

socketServer.sockets.on('connection', function(client){
  console.log(client);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// Start EasyRTC server
var rtc = easyrtc.listen(httpApp, socketServer);