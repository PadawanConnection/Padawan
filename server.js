/// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var easyrtc = require("easyrtc");           // EasyRTC external module
var morgan  = require("morgan");
var cors    = require('cors');
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/public/"));
httpApp.use(morgan('tiny'));
httpApp.use(cors());

httpApp.get('/:chat', function(req, res, next){
  res.json({msg: 'This is CORS-enabled for all origins!'});
});

// Start Express http server on port 3000
var webServer = http.createServer(httpApp).listen(3000);

// Start Socket.io so it attaches itself to Express server
var io = require("socket.io").listen(webServer); 

// Start EasyRTC server
var socketServer =io;
var rtc = easyrtc.listen(httpApp);

// Chatroom Server Logic
//to do: 1- add namespaces (topic of mentor chat so we can have multiple going on at same time)
// 2 - put in save functionality so chat can be recalled       
// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.sockets.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
  
  //chat room functionality
  // when the client emits 'add user', this listens and executes
  socket.sockets.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.sockets.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.sockets.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.sockets.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
//end chatroom server logic