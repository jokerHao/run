var CasaAlign = function()
{
	var $win = $(window),wid,hei,
	$im = $('#im');
	$int = $('#inputText');
	$pc = $int.find('#pinCode');

	this.setResize = function()
	{
		wid = $win.width();
		hei = $win.width();
		//
		var wh = 331/52;
		var pcHei = wid / wh * 0.73;
		$pc.css({
			'top':2,
			'line-height':pcHei+'px'
		});
		//console.log('pc:' + pcHei);
	}
	$win.resize(this.setResize);
	this.setResize();
}
