
BasicGame.ChoosePlayer = function (game) {

	this.music = null;
	this.playButton = null;
	this.playerId = GlobalPlayerFrame;
	this.maxCurOpen = localData.get('maxCurOpen') || 0
	localData.set('player1.png',true)
	this.style = {font: '25px Arial', fill: '#ffffff', align: 'center', fontWeight: 'bold', stroke: '#000000', strokeThickness: 6};
};

BasicGame.ChoosePlayer.prototype = {
	create: function () {
		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.add.sprite(this.world.centerX,this.world.centerY, 'preloaderBackground').anchor.set(0.5,0.5);

		var di = this.add.sprite(this.world.centerX,this.world.centerY, 'di')
		di.anchor.set(0.5);
		di.scale.set(4);
		this.playerManager = []

		var playersPic = ['player1.png','player2.png','alienGreen_front.png','alienPink_front.png',
			'alienYellow_front.png','bunny1_stand.png','bunny2_stand.png','alienBeige_front.png']

		var pricePlayer = [0,1,200,300,400,500,600,700]			

		var pos = [
			[this.game.width/4*1,200],[this.game.width/4*2,200],[this.game.width/4*3,200],
			[this.game.width/4*1,500],[this.game.width/4*2,500],[this.game.width/4*3,500],
			[this.game.width/4*1,800],[this.game.width/4*2,800],[this.game.width/4*3,800]
		]			
		for (var i = 0; i < playersPic.length; i++) {
			var bopen = localData.get(playersPic[i]) || false
			var p = this.add.sprite(pos[i][0],pos[i][1], 'players',playersPic[i])
			p.anchor.set(0.5)
			this.playerManager[i] = p
			p.idx = i
			p.inputEnabled = true;
			p.events.onInputDown.add(function(spr) {
				if (spr.idx <= this.maxCurOpen) {
					di.x = spr.x
					di.y = spr.y				
					this.playerId = spr.frameName
				};
				if (spr.idx == Number(this.maxCurOpen)+1) {
					if (!spr.keybtn) {
						spr.keybtn = this.add.button(pos[spr.idx][0],pos[spr.idx][1]+120, 'key',function () {
							if (Number(localData.get('mycoin')) >= pricePlayer[spr.idx]) {
								localData.set('mycoin',Number(localData.get('mycoin')) - pricePlayer[spr.idx])
								localData.set('maxCurOpen',spr.idx)
								this.maxCurOpen = spr.idx
								localData.set(playersPic[spr.idx],true)
								this.state.start('ChoosePlayer');
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
				if (spr.idx > Number(this.maxCurOpen)+1) {
					var text = this.add.text(pos[spr.idx][0],pos[spr.idx][1],'需解锁上一个角色',this.style);
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
				this.add.text(pos[i][0],pos[i][1],pricePlayer[i],this.style).anchor.set(0.5);
			};
		};
		var idx = 0
		for (var i = 0; i < playersPic.length; i++) {
			if (playersPic[i] == GlobalPlayerFrame) {
				idx = i
			};
		};
		di.x = this.playerManager[idx].x
		di.y = this.playerManager[idx].y

        this.scoreText = this.game.add.text(this.game.width-100, 100, "0", this.style);
        this.scoreText.anchor.set(0.5); 

        this.mycoin = this.game.add.text(100, 100, 'myCoin:'+localData.get('mycoin'), this.style);
        this.mycoin.anchor.set(0.5); 

		this.playButton = this.add.button(100,this.game.height-200, 'startNormal',this.backMenu, this, 2, 1, 0).anchor.set(0.5,0.5);
	},

	update: function () {
		this.scoreText.text = this.playerId
		this.mycoin.text = 'myCoin:'+localData.get('mycoin')
	},

	backMenu: function (pointer) {
		this.music.stop();
		localData.set('playerId',this.playerId)
		GlobalPlayerFrame = this.playerId
		this.state.start('MainMenu');
	}

};
