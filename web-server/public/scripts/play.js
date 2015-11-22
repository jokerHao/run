var cjo,ca;

var params;

function init()
{
	cjo = new CasaJudgeOrientation();

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

	var run = function () {
		left = false;
		right = false;
		speed++;
		if (speed>=3) {
			var val = speed;
			speed = 0;
			game.run(uid, val, function(){});		
		}
	}

	$('#btn_left').click(function(){
		left = true;
		if (right) {
			run();
		}
	});	
	$('#btn_right').click(function(){
		right = true;
		if (left) {
			run();
		}
	});	

	game.login(uid, function(){});
}
$(init);