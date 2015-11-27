var game = {};
var socket = io();
socket.requests = {};
socket.rid = 0;

socket.request = function (api, data, callback) {
	socket.rid ++;
	// data = data ? JSON.stringify(data) : null;
	var msg = {'id':socket.rid, 'api':api, 'data':data};
	socket.requests[socket.rid] = callback;
	// console.log('(' + socket.rid + ') [request] [' + api + '] :',data);
	socket.emit('request', msg);
};

socket.on('response', function(data){
	// console.log('(' + data.id + ') [response] : ',data);
	var handler = socket.requests[data.id];
	if (handler)
		handler(data.err, data.data);
});

/////////////
game.register = function (name, table_num, avatar, callback) {
	console.log('register..');
	socket.request('register', {'name':name, 'table_num':table_num, 'avatar':avatar}, callback);
};
game.auth = function (code, callback) {
	socket.request('auth', {'code':code}, callback);
};
game.login = function (uid, callback) {
	socket.request('login', {'uid':uid}, callback);
};
game.run = function (uid, speed) {
	socket.request('run', {'uid':uid, 'speed':speed});
};


// for display client
game.monitor = function (ready, start, restart, plogin, plogout) {
	// 抽籤完畢
	socket.on('game_ready', function(data){
		ready(data.err, data.data);
	});

	// 遊戲開始
	socket.on('game_start', function(data){
		start(data.err, data.data);
	});

	socket.on('game_restart', function(data){
		restart();
	});

	// 玩家登入
	socket.on('player_login', function(data){
		plogin(data.err, data.data);
	});

	// 玩家登出
	socket.on('player_logout', function(data){
		plogout(data.err, data.data);
	});

	socket.request('monitor', null, function(err, data){

	});
};
game.get_gameing = function (callback) {
	socket.request('get_gameing', null, callback);
}
game.get_score = function (callback) {
	socket.request('get_score', null, callback);
}
game.client_ready = function (callback) {
	socket.request('client_ready', null, callback);
}
game.client_start = function (callback) {
	socket.request('client_start', null, callback);
}
game.get_state = function (callback) {
	socket.request('get_state', null, callback);
}


// backend
game.init = function () {
	socket.request('init');
};
game.get_players = function (callback) {
	socket.request('get_players', null, callback);	
};
game.get_reg_state = function (callback) {
	socket.request('get_reg_state', null, callback);
};
game.reg_on = function (callback) {
	socket.request('reg_on', null, callback);
};
game.reg_off = function (callback) {
	socket.request('reg_off', null, callback);
};
game.opening = function (callback) {
	socket.request('opening', null, callback);
};
game.start = function (callback) {
	socket.request('start', null, callback);
};
game.restart = function () {
	socket.request('restart', null);
};


game.socket = socket;