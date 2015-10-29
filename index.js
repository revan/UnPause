var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/control', function(req, res){
  res.sendfile('control.html');
});

var stateEnum = Object.freeze({
	NEW: 0,
	PAUSE: 1,
	PLAY: 2});

var states = {};

io.on('connection', function(socket){
  states[socket.id] = stateEnum.NEW;
  socket.emit('init', states);

  socket.on('disconnect', function(){
  	io.emit('disco', socket.id);
  	delete states[socket.id];
  });

  socket.on('exempt', function(){
  	delete states[socket.id];
  })

  socket.on('vote-play', function(){
    io.emit('vote-play', socket.id);
    states[socket.id] = stateEnum.PLAY;
  });

  socket.on('vote-pause', function(){
    io.emit('vote-pause', socket.id);
    states[socket.id] = stateEnum.PAUSE;
  });

  socket.on('pause', function(){
    for (var key in states) {
    	states[key] = stateEnum.PAUSE;
    }

    io.emit('pause', states);
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});