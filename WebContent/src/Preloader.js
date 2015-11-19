
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
		this.preloadBar.anchor.set(0.5)
		this.load.setPreloadSprite(this.preloadBar);

		this.load.audio('titleMusic', 'sounds/bg1FightLoop.mp3');
		this.load.image('startNormal', 'images/kp-qianghua.png');
		this.load.image('fence', 'images/kp-qianghuaan.png');
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
		this.load.image('text_0', 'images/text_0.png');			
		this.load.image('text_1', 'images/text_1.png');			
		this.load.image('text_2', 'images/text_2.png');			
		this.load.image('text_3', 'images/text_3.png');			
		this.load.image('text_4', 'images/text_4.png');			
		this.load.image('text_5', 'images/text_5.png');			
		this.load.image('text_6', 'images/text_6.png');			
		this.load.image('text_7', 'images/text_7.png');			
		this.load.image('text_8', 'images/text_8.png');			
		this.load.image('text_9', 'images/text_9.png');			
		this.load.image('a', 'images/letter/a.png');			
		this.load.image('b', 'images/letter/b.png');			
		this.load.image('c', 'images/letter/c.png');			
		this.load.image('d', 'images/letter/d.png');			
		this.load.image('e', 'images/letter/e.png');			
		this.load.image('f', 'images/letter/f.png');			
		this.load.image('g', 'images/letter/g.png');			
		this.load.image('h', 'images/letter/h.png');			
		this.load.image('i', 'images/letter/i.png');			
		this.load.image('j', 'images/letter/j.png');			
		this.load.image('k', 'images/letter/k.png');			
		this.load.image('l', 'images/letter/l.png');			
		this.load.image('m', 'images/letter/m.png');			
		this.load.image('n', 'images/letter/n.png');			
		this.load.image('o', 'images/letter/o.png');			
		this.load.image('p', 'images/letter/p.png');			
		this.load.image('q', 'images/letter/q.png');			
		this.load.image('r', 'images/letter/r.png');			
		this.load.image('s', 'images/letter/s.png');			
		this.load.image('t', 'images/letter/t.png');			
		this.load.image('u', 'images/letter/u.png');			
		this.load.image('v', 'images/letter/v.png');			
		this.load.image('w', 'images/letter/w.png');			
		this.load.image('x', 'images/letter/x.png');			
		this.load.image('y', 'images/letter/y.png');			
		this.load.image('z', 'images/letter/z.png');			
		this.load.image('ranliao', 'images/tinyShroom_red.png');			
		this.load.image('lighting', 'images/lighting.png');		
		this.load.image('rocket', 'images/rocket.png');		
    	this.load.atlasJSONArray('bird', 'images/bird/bird.png', 'images/bird/bird.json');
    	this.load.atlasJSONArray('lightning', 'images/lightning.png', 'images/lightning.json');
    	this.load.atlasJSONArray('fire', 'images/fire.png', 'images/fire.json');
    	this.load.atlasJSONArray('smoke', 'images/smoke.png', 'images/smoke.json');
    	this.load.atlasJSONArray('heidong', 'images/heidong.png', 'images/heidong.json');
    	this.load.atlas('zhalans', 'images/zhalan.png', 'images/zhalan.json');
    	this.load.atlas('players', 'images/playerJson.png', 'images/playerJson.json');
		this.load.image('background', 'images/background.png');   	
		this.load.image('start', 'images/start.png');   	
		this.load.image('jiaban', 'images/jiaban.png');   	
		this.load.image('lightingbase', 'images/lightingbase.png');   	
		this.load.image('firebase', 'images/firebase.png');   	
		this.load.image('head', 'images/head.png');   	
	},

	create: function () {
		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
