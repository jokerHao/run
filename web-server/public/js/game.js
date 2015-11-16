var game = {};
var socket = io();
socket.requests = {};
socket.rid = 0;

socket.request = function (api, data, callback) {
	socket.rid ++;
	// data = data ? JSON.stringify(data) : null;
	var msg = {'id':socket.rid, 'api':api, 'data':data};
	socket.requests[socket.rid] = callback;
	console.log('(' + socket.rid + ') [request] [' + api + '] :',data);
	socket.emit('request', msg);
};

socket.on('response', function(data){
	console.log('(' + data.id + ') [response] : ',data);
	var handler = socket.requests[data.id];
	if (handler)
		handler(data.err, data.data);
});

/////////////
game.register = function (name, table_num, callback) {
	console.log('register..');
	socket.request('register', {'name':name, 'table_num':table_num}, callback);
};
game.login = function (code, callback) {
	socket.request('login', {'code':code}, callback);
};
game.run = function (pid, speed) {
	socket.request('run', {'pid':pid, 'speed':speed});
};


// for display client
game.monitor = function (ready, start, playerin) {
	socket.on('player_ready', function(data){
		console.log('player_ready 123');
		playerin(data.err, data.data);
	});
	socket.on('game_ready', function(data){
		console.log(data);
		ready(data.err, data.data);
	});
	socket.on('game_start', function(data){
		start(data.err, data.data);
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


game.socket = socket;