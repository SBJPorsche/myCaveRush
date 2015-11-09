
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		this.background = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBackground');
		this.background.anchor.set(0.5,0.5)
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.set(0.5,0.5)
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('titlepage', 'images/loadingImage.png');
		this.load.image('gamebg', 'images/bg03a.png');
		// this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		this.load.audio('titleMusic', 'sounds/bg1FightLoop.mp3');
		// this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		this.load.image('startNormal', 'images/kp-qianghua.png');
		this.load.image('walls', 'images/walls.png');
		this.load.image('fence', 'images/kp-qianghuaan.png');
		this.load.image('ropeNode', 'images/ropeNode.png');
		this.load.image('master', 'images/wingMan2.png');
		this.load.image('arrow', 'images/arrow.png');
		this.load.image('lock', 'images/suo.png');
		this.load.image('key', 'images/key.png');
		this.load.image('lock1', 'images/suo1.png');
		this.load.image('key1', 'images/key1.png');		
		this.load.image('yes', 'images/coin_bronze.png');		
		this.load.image('no', 'images/coin_silver.png');		
		this.load.image('card_26', 'images/card_26.png');		
		this.load.image('card_28', 'images/card_28.png');		
		this.load.image('card_38', 'images/card_38.png');		
		this.load.image('drag', 'images/drag.png');		
		this.load.image('touming', 'images/touming.png');		
		this.load.image('grass1', 'images/grass1.png');		
		this.load.image('grass2', 'images/grass2.png');		
		this.load.image('zha', 'images/zha.png');			
		this.load.image('lighting', 'images/lighting.png');		
		this.load.image('ground_wood_broken', 'images/ground_wood_broken.png');		
		this.load.image('player', 'images/com.tencent.plus.logo.png');
    	this.load.atlasJSONArray('bird', 'images/bird/bird.png', 'images/bird/bird.json');
		this.load.image('background', 'images/background.png');   	
	},

	create: function () {
		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('Game');
		}

	}

};
