
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {
		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.add.sprite(this.world.centerX,this.world.centerY, 'preloaderBackground').anchor.set(0.5,0.5);
		this.chooseRole = this.add.button(this.game.width-100,100, 'head',this.chooseRoleFunc, this, 2, 1, 0).anchor.set(0.5,0.5);
		var role = this.game.add.sprite(this.game.width-100,80,'players',GlobalPlayerFrame)
		role.anchor.set(0.5)
		role.scale.set(0.8)
		this.playButton = this.add.button(this.world.centerX,this.world.centerY, 'start',this.startGame, this, 2, 1, 0).anchor.set(0.5,0.5);
	},

	update: function () {
		//	Do some nice funky main menu effect here
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();
		//	And start the actual game
		this.state.start('Game');
	},
	chooseRoleFunc: function () {
		this.state.start('ChoosePlayer');
	}
};
