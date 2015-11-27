var Player = function (phaser, p) {
    this.phaser = phaser;
    var group = phaser.add.group();

	// var p = phaser.add.sprite(0, 0, 'player');
	
    var p = phaser.add.sprite(0, 0, 'player');
    p.order = 0;
    group.add(p);

    // 桌號底板
    var tb = phaser.add.sprite(0, 0, 'player_table');
    tb.anchor.setTo(0.5, 0.5);
    tb.order = 2;
	group.addChild(tb);
    tb.reset(8, 8);

    // 桌號文字
    var tt = phaser.add.text(10, 10, "0", {
        font: '16px Arial',
        fill: '#5A3616',
        align: 'center',
        strokeThickness: 1
    });
    tt.order = 3;
    tt.anchor.setTo(0.5, 0.5);
	group.addChild(tt);

    // 名稱
    var pn = phaser.add.text(95, 102, "name", {
        font: '16px Arial',
        fill: '#5A3616',
        align: 'right',
        strokeThickness: 1
    });
    pn.order = 1;
    pn.anchor.setTo(1, 0.5);
	group.addChild(pn);        

    //登入狀態
    var on = phaser.add.sprite(13, 102, 'player_on');
    on.anchor.setTo(0.5, 0.5);
    on.order = 1;
	group.addChild(on);    

    var off = phaser.add.sprite(13, 102, 'player_off');
    off.anchor.setTo(0.5, 0.5);
    off.order = 1;
	group.addChild(off);

	this.bodys = {};
	this.bodys['table_bg'] = tb;
	this.bodys['name'] = pn;
	this.bodys['table_num'] = tt;
	this.bodys['on'] = on;
	this.bodys['off'] = off;
	this.bodys['player'] = p;	
    // this.body = p;

    // group.visible = false;
    // this.visible = group.visible;
    this.body = group;

    this.body.customSort(function(a,b){return a.order - b.order});    
    this.score = 0;
};

Player.prototype.set = function (pid, name, table_num, avatar) {
    this.pid = pid;
	this.bodys['name'].text = name;
	this.bodys['table_num'].text = table_num;
    if (avatar) {
        console.log(pid, avatar);
        var data = new Image();
        data.src = avatar;
        this.phaser.cache.addImage('player_avatar_'+pid, avatar, data);         

        var av = this.phaser.add.sprite(12, 8, 'player_avatar_'+pid);
        // av.anchor.setTo(0.5, 0.5)
        av.width = 80;
        av.height = 80;
        av.order = 1;
        this.body.addChild(av); 
        this.body.customSort(function(a,b){return a.order - b.order});    
    }
};

Player.prototype.online = function (flag) {
	this.bodys['on'].visible = flag;
	this.bodys['off'].visible = !flag;
};

Player.prototype.visible = function (flag) {
	this.body.visible = flag;
};

Player.prototype.update = function (fps) {
    this.body.y -= (this.score/fps) * 15;
};

Player.prototype.end = function (r) {
    var rank = this.phaser.add.sprite(0, 0, 'rank');
    rank.parent = this.bodys['player'];
    rank.anchor.setTo(0, 1);
    var r = this.phaser.add.sprite(37, -22, 'rank' + r);
    r.parent = rank;    
}

