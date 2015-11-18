var STATE = {
	'IDLE': 0,
	'PREPARE': 1,
	'PLAY': 2,
	'QK': 3
}

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
		this.players[i].state = STATE.PREPARE;
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
	this.players[pid].state = STATE.PLAY;
	if (this.monitor) {
		this.monitor.emit('player_ready', {'err':null, 'data':{'pid':pid}});
	}

	for (var i in this.players) {
		if (this.players[i].state != STATE.PLAY) {
			return;
		}
	}
	// game start
	this.start = true;
	if (this.monitor) {
		this.monitor.emit('game_start', {'err':null, 'data':null});	
	}
}
Game.prototype.run = function (pid, speed) {
	if (this.start) {
		this.score[pid] += speed;
	}
};
Game.prototype.end = function () {
	// 將狀態改為休息
	for (var i in this.players) {
		this.players[i].state = STATE.QK;
	}
}

module.exports = Game;