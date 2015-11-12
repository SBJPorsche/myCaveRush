BasicGame = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false,


};

GlobalPlayerFrame = 'player1.png',

BasicGame.Boot = function (game) {
};

var firstRunLandscape;
BasicGame.Boot.prototype = {

    init: function () {
        this.input.maxPointers = 2;
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(360, 640, 720, 1280);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
        else
        {
            firstRunLandscape = this.scale.isGameLandscape;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(false, true);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

    },

    preload: function () {
        this.load.image('preloaderBackground', 'images/bg01.png');
        this.load.image('preloaderBar', 'images/jz_ggtiao.png');
    },

    create: function () {

        this.state.start('Preloader');

    },

    gameResized: function (width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device or resizing the browser window.
        //  Note that this callback is only really useful if you use a ScaleMode of RESIZE and place it inside your main game state.

    },

    enterIncorrectOrientation: function () {
        if(!this.game.device.desktop){
          document.getElementById("turn").style.display="block";
        }
    },

    leaveIncorrectOrientation: function () {
        if(!this.game.device.desktop){
          if(firstRunLandscape){
            gameRatio = window.innerWidth/window.innerHeight;       
            this.game.width = 720;
            this.game.height = Math.ceil(720/gameRatio);
            this.game.renderer.resize(this.game.width,this.game.height);
            this.game.state.start("Preloader");       
          }
          document.getElementById("turn").style.display="none";
        }
    }

};