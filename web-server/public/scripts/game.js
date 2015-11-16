var cjo,ca;


function init()
{
	cjo = new CasaJudgeOrientation();

	var params = {};
	if (location.search) {
	    var parts = location.search.substring(1).split('&');
	    for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;
	        params[nv[0]] = nv[1] || true;
	    }
	}
	console.log(params);
	var pid = params.pid;
	var right = true;
	var left = true;

	var run = function () {
		left = false;
		right = false;
		game.run(pid, 1, function(){});		
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
}



$(init);