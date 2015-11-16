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

			//cjo.setInit();
			//小胡function 寫這邊
			var code = $pc.val();
			game.login(code, function(err, data){
				if (err) {
					return alert('序號錯誤');
				}
				window.location.href = "control.html?pid="+data.pid;
			});
		})

	}

	this.setEvent();
}