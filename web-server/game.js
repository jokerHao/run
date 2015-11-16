var Socket = function() {
	this.io;
	this.sockets = {};
	this.handlers = {};
}
Socket.prototype.start = function (server) {
 	this.io = require('socket.io').listen(server);	
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
// ----

var Game = function (players, monitor) {
	this.players = {};
	for (var i in players) {
		var p = players[i];
		this.players[p.id] = p;
	}
	this.score = {};
	this.monitor = monitor;
	console.log(this.monitor)
	// 將狀態改為準備
	for (var i in this.players) {
		this.players[i].state = 1;
		this.score[i] = 0;
	}
	console.log('Game init');
	console.log(this.players);
	this.start = false;
	if (this.monitor) {
		this.monitor.emit('game_ready', {'err':null, 'data':this.players});
	}
};
Game.prototype.player_ready = function (pid) {
	// 狀態改為上場
	this.players[pid].state = 2;
	if (this.monitor)
		this.monitor.emit('player_ready', {'err':null, 'data':{'pid':pid}});

	for (var i in this.players) {
		if (this.players[i].state!=2) {
			return;
		}
	}
	// game start
	this.start = true;
	if (this.monitor)
		this.monitor.emit('game_start', {'err':null, 'data':null});	
}
Game.prototype.run = function (pid, speed) {
	if (this.start)
		this.score[pid] += speed;
};
Game.prototype.end = function () {
	// 將狀態改為休息
	for (var i in this.players) {
		this.players[i].state = 3;
	}
}

// -----------------------
// 應用層
// -----------------------
// player.state 0:等待, 1:準備, 2:上場, 3: 休息
var app = {};
var pid = 0;
var players = {};
var socket = new Socket();
var reg_state = 0;
var config = {
	'player' : 2
}
var gameing = null;
var monitor;

var getPlayerByCode = function (code) {
	for (var i in players) {
		if (players[i].code == code) {
			return players[i];
		}
	}
	return null;
}

// mobile
socket.handle('register', function(msg, callback){
	if (reg_state==0) {
		return callback(200, null);
	}
	pid ++;
  var code = Math.floor((Math.random() * 1000));
  code = code < 100 ? code + 100 : code;

	players[pid] = {'id':pid, 'name':msg.name, 'table_num':msg.table_num, 'order':Math.random(), 'state':0, 'code':code};
	callback(null, {'id':pid});
});
socket.handle('login', function(msg, callback){
	var player = getPlayerByCode(msg.code);
	callback();

	if (player && player.state==1) {
		player.state=2;
		callback(null, {'pid':player.id});
		gameing.player_ready(player.id);		
	}
	else {
		// 狀態錯誤
		callback(200);
	}
});
socket.handle('run', function(msg, callback){
	gameing.run(msg.pid, msg.speed);
});

// monitor
socket.handle('monitor', function(msg, callback){
	monitor = this;
});
socket.handle('get_score', function(msg, callback){
	callback(null, gameing.score);
});
socket.handle('get_gameing', function(msg, callback){
	callback(null, gameing ? {'start':gameing.start, 'players':gameing.players} : null);
});

// backend
socket.handle('init', function(msg, callback){
	gameing = null;
	players = {};
	pid = 0;
});
socket.handle('get_players', function(msg, callback){
	callback(null, players);
});
socket.handle('get_reg_state', function(msg, callback){
	callback(null, {'state':reg_state});
});
socket.handle('reg_on', function(msg, callback){
	reg_state = 1;
	callback();
});
socket.handle('reg_off', function(msg, callback){
	reg_state = 0;
	callback();
});
socket.handle('opening', function(msg, callback){
	// 抽等待中的玩家
	var ary = [];
	for (var i in players) {
		if (players[i].state==0)
			ary.push(players[i]);
	}
	ary.sort(function(a,b){return a.order-b.order});
	while(ary.length>config.player) {
		ary.pop();
	}
	gameing = new Game(ary, monitor);
	// call game
	callback();
});
socket.handle('start', function(msg, callback){
	callback();
});

app.start = function (server) {
	socket.start(server);
}
module.exports = app;