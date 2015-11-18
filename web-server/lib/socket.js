var socket_io = require('socket.io');

var Socket = function() {
	this.io;
	this.sockets = {};
	this.handlers = {};
}
Socket.prototype.init = function (server) {
 	this.io = socket_io.listen(server);	
 	var self = this;
	this.io.on('connection', function(socket){
	  console.log('user connected ',socket.id);
	  self.sockets[socket.id] = socket;

		// 
		socket.__on = socket.on;
		socket.__emit = socket.emit;
		socket.on = function (channel, next) {
			socket.__on(channel, function(msg){
				console.log('[on] channel: ' + channel + ' data: ',msg);				
				next(msg);
			});
		};
		socket.emit = function (channel, data) {
			console.log('[emit] channel: ' + channel + ' data: ',data);
		  socket.__emit(channel, data);
		};		

		// request response 機制
		// msg {'api':"", 'data':{}, 'id':0}
	  socket.on('request', function(msg){
	  	var handler = socket.handlers[msg.api];
	  	if (handler) {
	  		handler.call(socket, msg.data, function(err, data){
	  			socket.emit('response', {'id':msg.id, 'err':err, 'data':data});
	  		});
	  	}
	  });
		socket.handlers = {};
		socket.handle = function (api, handler) {
			socket.handlers[api] = handler;
		};

	  socket.on('disconnect', function(){
	    console.log('user disconnected ', socket.id);	  	
	  	delete self.sockets[socket.id];
	  });

		// setup handler
	  for (var i in self.handlers) {
	  	socket.handle(i, self.handlers[i]);
	  }
	});
}
Socket.prototype.handle = function (api, handler) {
	this.handlers[api] = handler;
};

module.exports = Socket;