
BasicGame.ChoosePlayer = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.ChoosePlayer.prototype = {

	create: function () {
		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.add.sprite(this.world.centerX,this.world.centerY, 'preloaderBackground').anchor.set(0.5,0.5);
		var playersPic = ['alienBeige_front.png','alienBlue_front.png','alienGreen_front.png','alienPink_front.png',
			'alienYellow_front.png','bunny1_stand.png','bunny2_stand.png','player1.png']
		var pos = [
			[this.game.width/4*1,200],[this.game.width/4*2,200],[this.game.width/4*3,200],
			[this.game.width/4*1,500],[this.game.width/4*2,500],[this.game.width/4*3,500],
			[this.game.width/4*1,800],[this.game.width/4*2,800],[this.game.width/4*3,800]
		]			
		for (var i = 0; i < playersPic.length; i++) {
			var p = this.add.sprite(pos[i][0],pos[i][1], 'players',playersPic[i])
			p.anchor.set(0.5)
			p.inputEnabled = true;
			p.events.onInputDown.add(function  (spr) {
				GlobalPlayerFrame = spr.frameName
				this.state.start('MainMenu');
			}, this); 
		};
		this.style = {font: '25px Arial', fill: '#ffffff', align: 'center', fontWeight: 'bold', stroke: '#000000', strokeThickness: 6};
        this.scoreText = this.game.add.text(this.game.width-100, 100, "0", this.style);
        this.scoreText.anchor.set(0.5); 

		this.playButton = this.add.button(100,this.game.height-200, 'startNormal',this.backMenu, this, 2, 1, 0).anchor.set(0.5,0.5);
	},

	update: function () {
		this.scoreText.text = GlobalPlayerFrame
		//	Do some nice funky main menu effect here

	},

	backMenu: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();
		//	And start the actual game
		this.state.start('MainMenu');
	}

};
