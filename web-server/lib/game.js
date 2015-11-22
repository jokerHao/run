var config_game = require('../config/game.json');

var Game = function (players, monitor) {
	this.b_start = false;
	this.b_start_c = false;	
	this.players = {};
	for (var i in players) {
		var p = players[i];
		this.players[p.id] = p;
	}
	this.score = {};
	this.monitor = monitor;
	// 將狀態改為準備
	for (var i in this.players) {
		this.players[i].state = config_game.PLAYER_STATE.PREPARE;
		this.score[i] = 0;
	}
	console.log('Game init');
	console.log(this.players);
	this.monitor.emit('game_ready', {'err':null, 'data':this.players});
};

// 玩家登入遊戲
Game.prototype.player_login = function (pid) {
	// 狀態改為上場
	this.players[pid].state = config_game.PLAYER_STATE.PLAY;
	this.monitor.emit('player_login', {'err':null, 'data':{'pid':pid}});
}
// 玩家斷線
Game.prototype.player_logout = function (pid) {
	// 狀態改為準備
	this.players[pid].state = config_game.PLAYER_STATE.PREPARE;
	this.monitor.emit('player_logout', {'err':null, 'data':{'pid':pid}});
}
// 後台啟動遊戲，等待遊戲回送確認就開始
Game.prototype.start = function () {
	for (var i in this.players) {
		if (this.players[i].state != config_game.PLAYER_STATE.PLAY) {
			console.log('有參賽玩家尚未登入');
			return '有參賽玩家尚未登入';
		}
	}
	if (!this.b_start_c) {
		console.log('客戶端尚未完成表演');
		return '客戶端尚未完成表演';
	}
	this.b_start = true;
	this.monitor.emit('game_start', {'err':null, 'data':null});	
	return null;
}
Game.prototype.client_ok = function () {
	// game start
	console.log('client_ok... wait admin start');
	this.b_start_c = true;
}
Game.prototype.getStatus = function () {
	return {'server':b_start, 'client':b_start_c, 'players':players};
}


// 玩家
Game.prototype.run = function (pid, speed) {
	if (this.b_start) {
		this.score[pid] += speed;
	}
};
Game.prototype.end = function () {
	// 將狀態改為休息
	for (var i in this.players) {
		this.players[i].state = config_game.PLAYER_STATE.QK;
	}
}

module.exports = Game;