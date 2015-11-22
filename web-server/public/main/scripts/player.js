var Player = function (phaser, p) {
    this.phaser = phaser;
    var group = phaser.add.group();

	// var p = phaser.add.sprite(0, 0, 'player');
	
	var p =  group.create(0, 0, 'player');

    // 桌號底板
    var tb = phaser.add.sprite(0, 0, 'player_table');
    tb.anchor.setTo(0.5, 0.5);
	group.addChild(tb);
    tb.reset(8, 8);

    // 桌號文字
    var tt = phaser.add.text(10, 10, "0", {
        font: '16px Arial',
        fill: '#5A3616',
        align: 'center',
        strokeThickness: 1
    });
    tt.anchor.setTo(0.5, 0.5);
	group.addChild(tt);

    // 名稱
    var pn = phaser.add.text(95, 102, "name", {
        font: '16px Arial',
        fill: '#5A3616',
        align: 'right',
        strokeThickness: 1
    });
    pn.anchor.setTo(1, 0.5);
	group.addChild(pn);        

    //登入狀態
    var on = phaser.add.sprite(13, 102, 'player_on');
    on.anchor.setTo(0.5, 0.5);
	group.addChild(on);    

    var off = phaser.add.sprite(13, 102, 'player_off');
    off.anchor.setTo(0.5, 0.5);
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

    this.score = 0;
};

Player.prototype.set = function (name, table_num) {
	this.bodys['name'].text = name;
	this.bodys['table_num'].text = table_num;	
};

Player.prototype.online = function (flag) {
	this.bodys['on'].visible = flag;
	this.bodys['off'].visible = !flag;
};

Player.prototype.visible = function (flag) {
	this.body.visible = flag;
};

Player.prototype.update = function () {
    this.body.y = 1060 - this.score * 10;
};

Player.prototype.end = function (r) {
    var rank = this.phaser.add.sprite(0, 0, 'rank');
    rank.parent = this.bodys['player'];
    rank.anchor.setTo(0, 1);
    var r = this.phaser.add.sprite(37, -22, 'rank' + r);
    r.parent = rank;    
};

