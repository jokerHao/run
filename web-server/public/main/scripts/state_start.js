var StateStart = function (phaser, start_at, onchange) {
	this.phaser = phaser;
	this.nums = [[],[]];
	this.bg;
	// 十位數
	this.show1;
	// 個位數
	this.show0;
	this.val;

	this.interval;

	this.start_at = start_at ? start_at : 60;
	this.onchange = onchange;
}

StateStart.prototype.preload = function () {
    // 開場
    this.phaser.load.image('start', 'assets/start/background.png');                
    for (var i=0; i<10; i++) {
        this.phaser.load.image('start' + i, 'assets/start/' + i + '.png');
    }        
};

StateStart.prototype.create = function () {
    this.bg = this.phaser.add.sprite(this.phaser.world.centerX, this.phaser.world.centerY, 'start');
    this.bg.anchor.setTo(0.5, 0.5);
    
    for (var ii=0; ii<2; ii++) {
    	var x = ii==1 ? -40 : 80;
    	for (var i=0; i<10; i++) {
   			var obj = this.phaser.add.sprite(x, 20, 'start'+i);	
   			obj.parent = this.bg;
   			obj.anchor.setTo(0.5, 0.5);
   			obj.visible = false;
   			this.nums[ii][i] = obj;
    	}
    }
    // 00
    show1 = this.nums[1][0];
    show0 = this.nums[0][0];
    this.setTime(this.start_at);
};


StateStart.prototype.start = function () {
    var self = this;
    this.setTime(this.start_at);
    if (this.interval) {
    	clearInterval(this.interval);
    }
    this.interval = setInterval(function(){ self.run(); }, 100);	
};

StateStart.prototype.reset = function (start_at, onchange) {
	this.start_at = start_at;
	this.onchange = onchange;
    // 00
    show1 = this.nums[1][0];
    show0 = this.nums[0][0];
    this.setTime(this.start_at);
    this.start();	
}

StateStart.prototype.update = function () {
	
};

StateStart.prototype.end = function () {
	this.bg.destroy();
	for (var ii=0; ii<2; ii++) {
    	for (var i=0; i<10; i++) {
    		this.nums[ii][i].destroy();
    	}
    }
};

// -----

StateStart.prototype.run = function () {
	this.time--;
	this.setTime(this.time);
	if (this.onchange)
		this.onchange(this.time);		
	if (this.time<=0) {
		clearInterval(this.interval);
		this.interval = null;
	}
}

StateStart.prototype.setTime = function (val) {
	this.time = val;

	var idx1,idx0;
	if (this.time<10) {
		idx1 = 0;
		idx0 = parseInt(this.time);
	}
	else {
		idx1 = parseInt(this.time.toString().substring(0,1));
		idx0 = parseInt(this.time.toString().substring(1,2));
	}
	show1.visible = false;
	show0.visible = false;

	show1 = this.nums[1][idx1];
	show0 = this.nums[0][idx0];

	show1.visible = true;
	show0.visible = true;
}
