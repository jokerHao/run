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
    this.phaser.load.image('start_bg', 'assets/start/background.png');                
    this.phaser.load.image('start_txt_start', 'assets/start/start.png');                
    this.phaser.load.image('start_txt_ready', 'assets/start/ready.png');                

    for (var i=0; i<10; i++) {
        this.phaser.load.image('start' + i, 'assets/start/' + i + '.png');
    }        
};

StateStart.prototype.create = function () {
    this.bg = this.phaser.add.sprite(this.phaser.world.centerX, this.phaser.world.centerY, 'start_bg');		
    this.bg.anchor.setTo(0.5, 0.5);
    
   	this.txt_ready = this.phaser.add.sprite(20, -120, 'start_txt_ready');
	this.txt_ready.anchor.setTo(0.5, 0.5);
	this.txt_ready.parent = this.bg;


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
    this.interval = setInterval(function(){ self.run(); }, 1000);	
};


StateStart.prototype.second = function (start_at) {
	this.txt_ready.visible = false;
   	this.txt_start = this.phaser.add.sprite(20, -120, 'start_txt_start');
	this.txt_start.anchor.setTo(0.5, 0.5);
	this.txt_start.parent = this.bg;	
	this.start_at = start_at;	
	this.setTime(this.start_at);
}

StateStart.prototype.second_start = function (onchange) {
	this.onchange = onchange;
    // 00
    show1 = this.nums[1][0];
    show0 = this.nums[0][0];
    this.start();	
}

StateStart.prototype.update = function () {
	
};

StateStart.prototype.end = function () {
	this.bg.destroy();
	this.txt_start.destroy();
	this.txt_ready.destroy();
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
	if (this.time<=0) {
		// end
		clearInterval(this.interval);
		this.interval = null;
	}
	if (this.onchange) {
		this.onchange(this.time);		
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
