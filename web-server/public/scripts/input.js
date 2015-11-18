var CasaInput = function()
{
	var $pc = $('#pinCode');
	this.setEvent = function()
	{
		$pc.focus(function(){
			isInput = true;
			cjo.killInit();
		})
		$pc.blur(function(){
			isInput = false;
			var code = $pc.val();
			game.login(code, function(err, data){
				if (err) {
					return alert('序號錯誤');
				}
				window.location.href = "play.html?pid="+data.pid;
			});
		})
	}
	this.setEvent();
}