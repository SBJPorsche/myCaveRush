
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator

    this.bRunBg = true

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
};

var easeInSpeed = function(x){
    return x * Math.abs(x) / 2000;
};

BasicGame.Game.prototype = {
    create: function () {
        this.bg = new BasicGame.BackGround(this.game)
        this.game.add.existing(this.bg);

        this.fenceGroup = this.game.add.group();
        this.fenceGroup.enableBody = true;

        this.birdGroup = this.game.add.group();
        this.birdGroup.enableBody = true;     

        this.arrowGroup = this.game.add.group();
        this.arrowGroup.enableBody = true;            

        this.player = new BasicGame.Player(this.game, this.game.width/2, this.game.height/2-200)
        this.game.add.existing(this.player);    

        this.master = this.game.add.sprite(this.game.width/2,-500,'master')
        this.master.anchor.set(0.5) 
        this.game.physics.enable(this.master, Phaser.Physics.ARCADE); 

        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        this.scoreText = this.game.add.text(this.game.width-100, 100, "0", style);
        this.scoreText.anchor.set(0.5); 

        var style = { font: "65px Arial", fill: "#ff0444", align: "center" };
        this.masterDistance = this.game.add.text(100, 100,'0', style);
        this.masterDistance.anchor.set(0.5);          

        this.game.time.events.loop(Phaser.Timer.SECOND*4, this.createEnemy, this);   
        this.game.time.events.start();

        //添加摇杆
        this.game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        this.game.touchControl.inputEnable();

        var _button1 = this.add.button(400, 80, 'buttons', function () {
            if (_button1.frame===1) {
                _button1.frame = 3;
                this.game.touchControl.settings.singleDirection = true;
            }else if (_button1.frame===3) {
                _button1.frame = 1;
                this.game.touchControl.settings.singleDirection = false;
            }
        }, this);
        _button1.frame=1;


        var _button2 = this.add.button(400, 20, 'buttons', function () {
            if (_button2.frame===2) {
                _button2.frame = 0;
                this.game.touchControl.inputEnable();
            }else if (_button2.frame===0) {
                _button2.frame = 2;
                this.game.touchControl.inputDisable();
            }
        }, this);
        _button2.frame=0;

        // this.add.button(400, 740, 'githubstar', function () {
        //     window.open('https://github.com/eugenioclrc/phaser-touch-control-plugin','_blank');
        // }, this,0,0,1,0).scale.set(0.5);

        // var style = {font: '25px Arial', fill: '#ffffff', align: 'left', fontWeight: 'bold', stroke: '#000000', strokeThickness: 6};
        // var tw = this.add.text(20, 20, 'Phaser Touch Plugin demo\nDeveloped by @eugenioclrc\nFor http://gamegur.us', style);
        // tw.inputEnabled = true;
        // tw.events.onInputDown.add(function(){
        //     window.open('https://twitter.com/eugenioclrc','_blank');
        // });

        this.directionsText = this.add.text(20, 740, '', style);
        this.velocityText = this.add.text(200, 740, '', style);         
    },

    // updateDebugText: function(){
        // this.directionsText.setText('directions: {\n  up: ' + this.game.touchControl.cursors.up +
        //     ',\n  down: ' + this.game.touchControl.cursors.down + ',\n  left: ' + this.game.touchControl.cursors.left + 
        //     ',\n  right: ' + this.game.touchControl.cursors.right + ',\n}');
        // this.velocityText.setText('velocity: {\n  x: ' + this.game.touchControl.speed.x + ',\n  y: ' + this.game.touchControl.speed.y + '\n}');
    // },    

    update: function () {
        if (this.bRunBg == false) {
            this.master.y = this.master.y + 1 // 怪物逼近
        } else{
            this.bg.updateBg()// 刷新背景图
        };

        this.scoreText.text = this.bg.distance

        this.masterDistance.text = Math.ceil(this.game.physics.arcade.distanceBetween(this.master,this.player))

        this.game.physics.arcade.collide(this.player,this.fenceGroup, function () {
            this.bRunBg = false
        }, null, this); //与fence碰撞

        this.game.physics.arcade.collide(this.player,this.arrowGroup, function () {
            this.bRunBg = false
        }, null, this); //与arrow碰撞  
        this.arrowGroup.forEachExists(function(arrow){
            if (arrow.y < 0) {
                this.arrowGroup.remove(arrow)
            };
        }, this); 

        this.game.physics.arcade.overlap(this.player,this.birdGroup, function () {
            this.quitGame();
        }, null, this); //与bird碰撞
        this.birdGroup.forEachExists(function(bird){
            if (bird.y < 0) {
                this.birdGroup.remove(bird)
            };
        }, this);  

        this.game.physics.arcade.overlap(this.player,this.master, function () {
            this.quitGame();
        }, null, this); //与master碰撞     

        var speed = this.game.touchControl.speed;

        this.player.y -= easeInSpeed(speed.y);
        this.player.x -= easeInSpeed(speed.x);
        // Also you could try linear speed;
        //this.player.y += this.game.touchControl.speed.y / 20;
        //this.player.x += this.game.touchControl.speed.x / 20;
    },

    quitGame: function (pointer) {
        this.bRunBg = true
        this.state.start('MainMenu');
    },
    render: function () {
        // this.game.debug.spriteInfo(this.test, 64, 64);
    },

    createEnemy: function () {
        // 暂时有敌人障碍，不出现先障碍
        if (this.bRunBg == false) { return };

        var type = this.game.rnd.integerInRange(1, 3);
        if (type == 1) {
            if (this.fenceGroup.length > 0) {return};

            var fence = this.game.add.sprite(this.game.width/2, this.game.height+80, 'fence', null, this.fenceGroup);
            fence.anchor.set(0.5)
            fence.scale.x = 4
            fence.inputEnabled = true;
            fence.events.onInputDown.add(function  () {
                fence.kill()
                this.fenceGroup.remove(fence)
                this.bRunBg = true;
            }, this); 
            this.fenceGroup.setAll('outOfBoundsKill',true);
            this.fenceGroup.setAll('body.gravity.y', -80);                    
        };

        if (type == 2) {
            if (this.birdGroup.length > 0) {return};

            var bird = this.game.add.sprite(this.game.width, this.game.height+80, 'bird', null, this.birdGroup);
            this.game.add.tween(bird).to({ x: 0 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);    
            bird.anchor.set(0.5)
            bird.animations.add('fly');
            bird.animations.play('fly', 30, true);
            bird.scale.set(1.2)     
            bird.inputEnabled = true;
            bird.events.onInputDown.add(function  () {
                bird.kill()
                this.birdGroup.remove(bird)
                this.bRunBg = true;
            }, this); 
            this.birdGroup.setAll('outOfBoundsKill',true);
            this.birdGroup.setAll('body.gravity.y', -80);                     
        };

        if (type == 3) {
            if (this.arrowGroup.length > 0) {return};
            var typeArrow = this.game.rnd.integerInRange(1, 2);
            var perX

            var arrow = this.game.add.sprite(this.game.width/2, this.game.height+80, 'arrow', null, this.arrowGroup);
            arrow.anchor.set(0.5)
            arrow.scale.set(4)
            if (typeArrow == 1) {arrow.angle = 180};
            arrow.inputEnabled = true;
            arrow.input.useHandCursor = true;
            arrow.input.allowHorizontalDrag = true;
            arrow.input.allowVerticalDrag = false;            
            arrow.input.enableDrag();
            arrow.events.onDragStart.add(function () {
                // sprite.body.moves = false; 
                perX = arrow.x
            }, this);
            arrow.events.onDragUpdate.add(function () {
                if (typeArrow == 1) {
                    if ((arrow.x - perX) > 0) {arrow.x = perX};
                    if (arrow.x < 50) {
                        arrow.kill()
                        this.arrowGroup.remove(arrow)
                        this.bRunBg = true;
                    };                    

                } else{
                    if ((arrow.x - perX) < 0) {arrow.x = perX};
                    if (arrow.x > this.game.width-50) {
                        arrow.kill()
                        this.arrowGroup.remove(arrow)
                        this.bRunBg = true;
                    };
                };
            }, this);            
            arrow.events.onDragStop.add(function () {
            }, this); 
            this.arrowGroup.setAll('outOfBoundsKill',true);
            this.arrowGroup.setAll('body.gravity.y', -80);
        };        
    },
};
