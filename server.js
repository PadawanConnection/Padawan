// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module


// Setup and configure Express http server. Expect a subfolder called "public" to be the web root.
var app = express();
app.use(express.static(__dirname + "/public/"));


// Start Express http server on port 3000
var webServer = http.createServer(app).listen(3000);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer);

app.get('/', function (req, res) {
  res.send('index.html');
});
