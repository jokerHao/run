var config_game = require('../config/game.json');

var Game = function (players, monitor) {
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
};
// 玩家斷線
Game.prototype.player_logout = function (pid) {
	// 狀態改為準備
	this.players[pid].state = config_game.PLAYER_STATE.PREPARE;
	this.monitor.emit('player_logout', {'err':null, 'data':{'pid':pid}});
};
// 後台啟動遊戲，等待遊戲回送確認就開始
Game.prototype.start = function () {
	console.log('後台啟動遊戲');
	this.monitor.emit('game_start', {'err':null, 'data':null});	
};

// 玩家
Game.prototype.run = function (pid, speed) {
	this.score[pid] = speed;
};
Game.prototype.end = function () {
	// 將狀態改為休息
	for (var i in this.players) {
		this.players[i].state = config_game.PLAYER_STATE.QK;
	}
};
Game.prototype.isReady = function () {
	for (var i in this.players) {
		if (this.players[i].state != config_game.PLAYER_STATE.PLAY) {
			return false;
		}
	}
	return true;
};


module.exports = Game;