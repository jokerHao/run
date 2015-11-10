var io;
var app = {};

var run = function (uid, speed) {

}

app.start = function (server) {
 	io = require('socket.io').listen(server);	
	io.on('connection', function(socket){
	  console.log('a user connected');

	  socket.on('disconnect', function(){
	    console.log('user disconnected');
	  });

		socket.on('run', function(msg){
			console.log('message: ' + msg);
		});

		socket.__emit = socket.emit
		socket.emit = function (channel, data) {
			console.log(channel);
		  var data = data ? JSON.parse(data) : null;
		  socket.__emit(channel, data);
		};		
	});
}

app.listen = function (server) {

}

module.exports = app;