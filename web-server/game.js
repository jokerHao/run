var Socket = require('./lib/socket.js');
var Game = require('./lib/game.js');
var socket = new Socket();

// -----------------------
// 應用層
// -----------------------
// player.state 0:等待, 1:準備, 2:上場, 3: 休息
var app = {};
var pid = 0;
var players = {};
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

	if (player && (player.state==1 || player.state==2)) {
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
	socket.init(server);
}
module.exports = app;