
BasicGame.ChooseEqp = function (game) {

	this.music = null;
	this.playButton = null;
	this.eqpId = GlobalEqpFrame;
	this.maxCurOpenEqp = localData.get('maxCurOpenEqp') || 0
	localData.set('rocket.png',true)
	this.style = {font: '25px Arial', fill: '#ffffff', align: 'center', fontWeight: 'bold', stroke: '#000000', strokeThickness: 6};
};

BasicGame.ChooseEqp.prototype = {
	create: function () {
		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.add.sprite(this.world.centerX,this.world.centerY, 'preloaderBackground').anchor.set(0.5,0.5);

		var di = this.add.sprite(this.world.centerX,this.world.centerY, 'di')
		di.anchor.set(0.5);
		di.scale.set(4);
		this.eqpManager = []

		var eqpsPic = ['rocket.png','jetpack.png','cloud.png','castle_beige.png']

		var priceEqp = [0,100,200,300]			

		var pos = [
			[this.game.width/4*1,200],[this.game.width/4*2,200],[this.game.width/4*3,200],
			[this.game.width/4*1,500],[this.game.width/4*2,500],[this.game.width/4*3,500],
			[this.game.width/4*1,800],[this.game.width/4*2,800],[this.game.width/4*3,800]
		]			
		for (var i = 0; i < eqpsPic.length; i++) {
			var bopen = localData.get(eqpsPic[i]) || false
			var p = this.add.sprite(pos[i][0],pos[i][1], 'players',eqpsPic[i])
			p.anchor.set(0.5)
			this.eqpManager[i] = p
			p.idx = i
			p.inputEnabled = true;
			p.events.onInputDown.add(function(spr) {
				if (spr.idx <= this.maxCurOpenEqp) {
					di.x = spr.x
					di.y = spr.y				
					this.eqpId = spr.frameName
				};
				if (spr.idx == Number(this.maxCurOpenEqp)+1) {
					if (!spr.keybtn) {
						spr.keybtn = this.add.button(pos[spr.idx][0],pos[spr.idx][1]+120, 'key',function () {
							if (Number(localData.get('mycoin')) >= priceEqp[spr.idx]) {
								localData.set('mycoin',Number(localData.get('mycoin')) - priceEqp[spr.idx])
								localData.set('maxCurOpenEqp',spr.idx)
								this.maxCurOpenEqp = spr.idx
								localData.set(eqpsPic[spr.idx],true)
								this.state.start('ChooseEqp');
							}else{
								var text = this.add.text(this.game.width/2,this.game.height/2,'金币不足',this.style);
								text.anchor.set(0.5)
								text.scale.set(0.2)
								var tween = this.game.add.tween(text.scale)
								tween.to({ x: 1.2,y:1.2 }, 2000, Phaser.Easing.Quadratic.InOut); 
								tween.start();
								tween.onComplete.addOnce(function () {
									text.kill();
								},this);								
							};
						}, this, 2, 1, 0)
						spr.keybtn.anchor.set(0.5)
					};
				};	
				if (spr.idx > Number(this.maxCurOpenEqp)+1) {
					var text = this.add.text(pos[spr.idx][0],pos[spr.idx][1],'需解锁上一个装备',this.style);
					text.anchor.set(0.5)
					text.scale.set(0.2)
					var tween = this.game.add.tween(text.scale)
			        tween.to({ x: 1.2,y:1.2 }, 2000, Phaser.Easing.Quadratic.InOut); 
			        tween.start();
			        tween.onComplete.addOnce(function () {
			        	text.kill();
			        },this);
				};							
			}, this); 
			if (bopen == false) {
				var p = this.add.sprite(pos[i][0],pos[i][1], 'lock')
				p.anchor.set(0.5)
				this.add.text(pos[i][0],pos[i][1],priceEqp[i],this.style).anchor.set(0.5);
			};
		};
		var idx = 0
		for (var i = 0; i < eqpsPic.length; i++) {
			if (eqpsPic[i] == GlobalEqpFrame) {
				idx = i
			};
		};
		di.x = this.eqpManager[idx].x
		di.y = this.eqpManager[idx].y

        this.scoreText = this.game.add.text(this.game.width-100, 100, "0", this.style);
        this.scoreText.anchor.set(0.5); 

        this.mycoin = this.game.add.text(100, 100, 'myCoin:'+localData.get('mycoin'), this.style);
        this.mycoin.anchor.set(0.5); 

		this.playButton = this.add.button(100,this.game.height-200, 'startNormal',this.backMenu, this, 2, 1, 0).anchor.set(0.5,0.5);
	},

	update: function () {
		this.scoreText.text = this.eqpId
		this.mycoin.text = 'myCoin:'+localData.get('mycoin')
	},

	backMenu: function (pointer) {
		this.music.stop();
		localData.set('eqpId',this.eqpId)
		GlobalEqpFrame = this.eqpId
		this.state.start('MainMenu');
	}

};
