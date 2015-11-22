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
			game.auth(code, function(err, data){
				if (err) {
					return alert('序號錯誤');
				}
				window.location.href = "play.html?uid="+data.uid;
			});
		})
	}
	this.setEvent();
}