var cjo,ca;

var params;

function init()
{
	// cjo = new CasaJudgeOrientation();

	// 取參數
	params = {};
	if (location.search) {
	    var parts = location.search.substring(1).split('&');
	    for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;
	        params[nv[0]] = nv[1] || true;
	    }
	}


	var uid = params.uid;
	var right = true;
	var left = true;

	var speed = 0;
	var is_start = false;
	var update_time = 300;
	var XX = 5;
	var speeds = [];

	var send = function () {
		var s = 0;
		var c = 0;
		for (var i=speeds.length-1; c<XX; i--) {
			// console.log(i);
			// console.log(speeds[i]);
			if (speeds[i]!=null) {
				c++;
				s += speeds[i];
			}
			else {
				break;
			}
		}
		var time = c * update_time;
		var rate = c==0 ? 0 : (s/time * 1000);



		console.log('time: %s speed: %o  rate: %o ____ %o ____ %o', time, s, rate, speeds, c);
		game.run(uid, rate, function(){});					
	}

	var update = function () {
		speeds.push(speed);
		speed = 0;
	}

	var run = function () {
		if (!is_start) {
		    return;
		}
		// left = false;
		// right = false;
		speed++;
	}

	var check = function () {
		if (is_start) {
			return;
		}
		setTimeout(function(){
		    game.get_state(function(err, data) {
		        is_start = data.state==4;
		        if (is_start) {
			        setInterval(update, update_time);
			        setInterval(send, update_time * XX);
		    	}
		        check();
		    });			
		}, 500);
	}

	$('#btn_left').click(function(){
		// left = true;
		// if (right) {
			run();
		// }
	});	
	$('#btn_right').click(function(){
		// right = true;
		// if (left) {
			run();
		// }
	});	
	game.login(uid, function(){
		check();
	});
}
$(document).ready(function(){
	init();
});