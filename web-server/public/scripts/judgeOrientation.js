var CasaJudgeOrientation = function()
{
	var _this = this;
	var $win = $(window);
	this.setInit = function()
	{
		// $win.on( "orientationchange", function( event ) {
		// 	if(event.orientation == 'portrait')
		// 	{
		// 		_this.hideTip();
		// 	}else{
		// 		_this.showTip();
		// 	}
		// });
		$win.resize(function(){
			if($win.width() < $win.height())
			{
				_this.hideTip();
			}
			else if(isInput){
				_this.hideTip();
			}
			else{
				if(!isInput)
				{
					_this.showTip();
				}
			}
		})
		//
		var wid = $win.width();
		var hei = $win.height();
		//
		if(wid > hei)
		{
			_this.showTip();
		}
	}
	this.showTip = function()
	{
		if($('#tip').length <= 0)
		{
			$('body').append('<div id="tip"><p>請手機使用直式瀏覽</p></div>');
		}
	};

	this.hideTip = function()
	{
		if($('#tip').length >= 0)
		{
			$('#tip').remove();
		}
	};
	this.killInit = function()
	{
		this.setInit = null;
		$win.off('resize');
		console.log('kill');
	}
	this.setInit();
};




