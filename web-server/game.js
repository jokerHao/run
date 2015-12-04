var ROOT = "../";

var fs = require('fs');
var moment = require('moment');

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
var gameing = null;
var monitor = null;
var STATE = {
	'REGISTER': 0,		// 報名
	"PAUSE": 	1,		// 停止報名
	"WAIT": 	2,		// 已抽出選手 等待登入
	"READY": 	3,		// 客戶端表演結束 且選手皆已登入
	"PLAY": 	4		//
};
var state = STATE.REGISTER;

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

var playerLog = function (player) {
	var filename = moment().format("YYYY-MM-DD");
	var filepath = ROOT + "log/" + filename;
	console.log(filepath);
	var str = JSON.stringify(player) + "@#$";
	fs.appendFile(filepath, str, function(err) {
        if (err) {
            console.log(err);
        }
    });
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
	if (state!=STATE.REGISTER) {
		return callback(200);
	}

	// 暱稱不能重複
	if (getPlayerBy('name', msg.name)) {
		return callback(300);
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


	var player = {
		'id': pid, 
		'name': msg.name, 
		'table_num': msg.table_num, 
		'avatar': msg.avatar,
		'order': order, 
		'state': config_game.PLAYER_STATE.IDLE, 
		'code': code, 
		'reg_time': time,
		'uid': "",
		'rank': "",
		'gid': "",
		'share': false
	};

	pid ++;
	players[pid] = player;
	callback(null, {'pid':pid});
	playerLog(player);
});

// 分享
socket.handle('share', function(msg, callback){
	var pid = msg.pid;
	if (players[pid]) {
		players[pid].share = true;	
	}
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
	if (state!=STATE.PLAY) {
		return;
	}
	var player = uid_map[msg.uid];
	if (!player) {
		return console.log('uid fail');
	}
	// console.log('run  ', player.id);
	gameing.run(player.id, parseFloat(msg.speed));
});
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
// 電子看板 monitor
socket.handle('monitor', function(msg, callback){
	monitor = this;
	if (gameing) {
		gameing.monitor = this;
	}
});
socket.handle('get_score', function(msg, callback){
	callback(null, gameing ? gameing.score : 0);
});
// socket.handle('get_gameing', function(msg, callback){
// 	callback(null, gameing ? {'start':gameing.start, 'players':gameing.players} : null);
// });
socket.handle('client_ready', function(msg, callback){
	if (state==STATE.WAIT) {
		state = STATE.READY;
	}
	else {
		console.log('state error ',state);
	}
});
// 客戶端倒數完呼叫
socket.handle('client_start', function(msg, callback){
	if (state==STATE.READY) {
		state = STATE.PLAY;
	}
	callback();
});
socket.handle('client_end', function(msg, callback){
	if (gameing) {
		for (var i in msg.rank) {
			var pid = msg.rank[i];
			players[pid].rank = i;
		}
	}
	else {
		console.log('no game...');
	}
});
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////


// backend
socket.handle('init', function(msg, callback){
	state = STATE.REGISTER;		
	uid_map = {};
	gameing = null;
	players = {};
	pid = 0;
});
socket.handle('get_players', function(msg, callback){
	callback(null, players);
});
socket.handle('get_state', function(msg, callback){
	callback(null, {'state':state});
});
socket.handle('reg_on', function(msg, callback){
	if (state==STATE.PAUSE) {
		state = STATE.REGISTER;
	}
	callback();
});
socket.handle('reg_off', function(msg, callback){
	if (state==STATE.REGISTER) {
		state = STATE.PAUSE;
	}
	callback();
});
// 抽籤
socket.handle('opening', function(msg, callback){

	if (!monitor) {
		return callback(403);
	}

	// 結束上一場
	uid_map = {};
	if (gameing) {
		for (var i in gameing.players) {
			gameing.players[i].uid = "";
		}
		gameing.end();
	}
	state = STATE.WAIT;	
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

	for (var i in ary) {
		ary[i].gid = gid;
	}
	gameing = new Game(ary, monitor);
	gameing.id = gid;
	gid++;
	// call game
	callback();
});
socket.handle('start', function(msg, callback) {
	if (state!=STATE.READY) {
		return callback('state err', state);
	}
	// 檢查玩家是否都登入
	// if (gameing.isReady()) {
	// 	gameing.start();
	// 	callback();
	// }
	// else {
	// 	callback('玩家尚未登入');
	// }

	gameing.start();
});
socket.handle('restart', function(msg, callback){
	if (monitor) {
		monitor.emit('game_restart', {'err':null, 'data':null});	
	}
});


app.start = function (server) {
	socket.init(server);
}
module.exports = app;