var config_game = require('./config/game.json');

var Socket = require('./lib/socket.js');
var Game = require('./lib/game.js');

var socket = new Socket();

// -----------------------
// 應用層
// -----------------------
// player.state 0:等待, 1:準備, 2:上場, 3: 休息
var app = {};
var pid = 0;
var gid = 0;
var players = {};

// uid : player
var uid_map = {};
var reg_state = 0;
var gameing = null;
var monitor;

var getPlayerBy = function (key, val) {
	for (var i in players) {
		if (players[i][key] == val) {
			return players[i];
		}
	}
	return null;
}

var getCode = function () {
	var code = Math.floor((Math.random() * 1000));
	code = code < 100 ? code + 100 : code;
	return code;
}

var getTimestamp = function () {
	return Math.floor(Date.now() / 1000);
}

socket.onConnect = function () {

};

socket.onDisconnect = function () {
	var pid = this.pid;
	var gid = this.gid
	if (this.pid && gameing && gameing.id==gid) {
		console.log('player disconnect : ', pid);
		gameing.player_logout(this.pid);
	}
};

// mobile
socket.handle('register', function(msg, callback){
	if (reg_state==0) {
		return callback(200, null);
	}

	// 確保序號不重複
	var code = 0;
	while (true) {
		code = getCode();
		if (!getPlayerBy('code', code)) {
			break;
		}
	}

	// 註冊時間
	var time = getTimestamp();

	// 抽籤順序
	var order = Math.random();

	pid ++;
	players[pid] = {
		'id': pid, 
		'name': msg.name, 
		'table_num': msg.table_num, 
		'order': order, 
		'state': config_game.PLAYER_STATE.IDLE, 
		'code': code, 
		'reg_time': time,
		'uid': ""
	};
	callback(null, {'pid':pid});
});


// --- 使用序號登入 login.html
socket.handle('auth', function(msg, callback){
	var player = getPlayerBy('code', msg.code);	

	// 玩家不存在
	if (!player) {
		return callback(200);
	}

	// 狀態錯誤
	if (player.state==config_game.PLAYER_STATE.IDLE || player.state==config_game.PLAYER_STATE.QK) {
		return callback(201);
	}

	// 如果玩家重複登入 踢除前一個玩家的控制權 (覆蓋uid)
	// 取得uid 並確保序號不重複
	var code;
	while (true) {
		code = getCode();
		if (!getPlayerBy('uid', code)) {
			break;
		}
	}
	player.uid = code;

	callback(null, {'uid': player.uid});			
});

////////////////////////////////////////////////////////
// --- 操作頁 play.html
socket.handle('login', function(msg, callback){
	var player = getPlayerBy('uid', msg.uid);
	if (player) {

		// 移除前一個登入
		var pre_uid;
		for (var i in uid_map) {
			if (uid_map[i].id==player.id) {
				pre_uid = i;
			}
		}
		if (pre_uid) {
			delete uid_map[pre_uid];
		}

		uid_map[msg.uid] = player;
		gameing.player_login(player.id);
		this.pid = player.id;
		this.gid = gameing.id;
		callback(null, null);		
	}
	else {
		// 錯誤
		callback(200);
	}
});
socket.handle('run', function(msg, callback) {
	var player = uid_map[msg.uid];
	if (!player) {
		return console.log('uid fail');
	}
	console.log('run  ', player.id);
	gameing.run(player.id, parseInt(msg.speed));
});
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////


// monitor
socket.handle('monitor', function(msg, callback){
	monitor = this;
	if (gameing) {
		gameing.monitor = this;
	}
});
socket.handle('get_score', function(msg, callback){
	callback(null, gameing ? gameing.score : 0);
});
socket.handle('get_gameing', function(msg, callback){
	callback(null, gameing ? {'start':gameing.start, 'players':gameing.players} : null);
});
socket.handle('client_ok', function(msg, callback){
	gameing.client_ok();
});

// backend
socket.handle('init', function(msg, callback){
	uid_map = {};
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
// 抽籤
socket.handle('opening', function(msg, callback){
	// 結束上一場
	if (gameing) {
		gameing.end();
	}
	// 抽等待中的玩家
	var ary = [];
	for (var i in players) {
		if (players[i].state==config_game.PLAYER_STATE.IDLE) {
			ary.push(players[i]);
		}
	}
	if (ary.length < 6) {
		return callback(200);
	}
	ary.sort(function(a,b){return a.order-b.order});
	while(ary.length > 6) {
		ary.pop();
	}

	gameing = new Game(ary, monitor);
	gameing.id = gid;
	gid++;
	// call game
	callback();
});
socket.handle('start', function(msg, callback){
	var err = gameing!=null ? gameing.start() : '尚未開局';
	callback(err);
});
socket.handle('getStatus', function(msg, callback){
	var data = gameing!=null ? gameing.getStatus() : null;
	callback(null, err);
});


app.start = function (server) {
	socket.init(server);
}
module.exports = app;