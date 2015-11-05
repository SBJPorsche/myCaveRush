
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
    this.offsetY = 0

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
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

        this.lockGroup = this.game.add.group();
        this.lockGroup.enableBody = true;  

        this.cardGroup = this.game.add.group();
        this.cardGroup.enableBody = true;                           

        this.player = new BasicGame.Player(this.game, this.game.width/2, this.game.height/2-200)
        this.game.add.existing(this.player);    

        this.master = this.game.add.sprite(this.game.width/2,-300,'master')
        this.master.anchor.set(0.5) 
        this.game.physics.enable(this.master, Phaser.Physics.ARCADE); 

        var style = {font: '25px Arial', fill: '#ffffff', align: 'center', fontWeight: 'bold', stroke: '#000000', strokeThickness: 6};
        this.scoreText = this.game.add.text(this.game.width-100, 100, "0", style);
        this.scoreText.anchor.set(0.5); 

        this.masterDistance = this.game.add.text(100, 100,'0', style);
        this.masterDistance.anchor.set(0.5);   

        this.textcnt = this.game.add.text(100, 400,0, style);
        this.textcnt.anchor.set(0.5);                

        this.game.time.events.loop(Phaser.Timer.SECOND*3, this.createEnemy, this);   
        this.game.time.events.start();       
    },

    update: function () {
        if (this.bRunBg == false) {
            if (this.master.y > 0) {
                this.master.y = this.master.y + 1 + this.offsetY // 怪物逼近
                this.offsetY += 0.1
            } else{
                this.master.y = this.master.y + 1 // 怪物逼近
            };
        } else{
            this.bg.updateBg()// 刷新背景图
        };

        this.scoreText.text = this.bg.distance
        this.textcnt.text = this.cardGroup.length

        var twoheight = this.master.height/2+this.player.height/2
        this.masterDistance.text = Math.max(Math.ceil(this.game.physics.arcade.distanceBetween(this.master,this.player)-twoheight),0)
        
        //与fence碰撞
        this.game.physics.arcade.collide(this.player,this.fenceGroup, function () {
            this.bRunBg = false
        }, null, this); 
        this.fenceGroup.forEachExists(function(fence){
            if (this.bRunBg == false) {
                fence.body.moves = false
            }else{
                fence.body.moves = true
            };            
            if (fence.y < 0) {
                this.fenceGroup.remove(fence)
            };
        }, this);         
        
        //与arrow碰撞  
        this.game.physics.arcade.collide(this.player,this.arrowGroup, function () {
            this.bRunBg = false
        }, null, this); 
        this.arrowGroup.forEachExists(function(arrow){
            if (this.bRunBg == false) {
                arrow.body.moves = false
            }else{
                arrow.body.moves = true
            };            
            if (arrow.y < 0) {
                arrow.kill();
                this.arrowGroup.remove(arrow)
            };
        }, this); 
        
        //与bird碰撞
        this.game.physics.arcade.overlap(this.player,this.birdGroup, function () {
            this.quitGame();
        }, null, this); 
        this.birdGroup.forEachExists(function(bird){
            if (this.bRunBg == false) {
                bird.body.moves = false
            }else{
                bird.body.moves = true
            };
            if (bird.y < 0) {
                this.birdGroup.remove(bird)
            };
        }, this);  
        
        //与lock碰撞
        this.game.physics.arcade.collide(this.player,this.lockGroup, function () {
            this.bRunBg = false
        }, null, this);   
        this.lockGroup.forEachExists(function(lock){
            if (this.bRunBg == false) {
                lock.body.moves = false
            }else{
                lock.body.moves = true
            };            
            if (lock.y < 0) {
                this.lockGroup.remove(lock)
            };
        }, this);  

        //与card碰撞
        this.game.physics.arcade.overlap(this.player,this.cardGroup, function () {
            this.bRunBg = false
        }, null, this); 
        // this.cardGroup.forEachExists(function(card){
        //     if (this.bRunBg == false) {
        //         card.body.moves = false
        //     }else{
        //         card.body.moves = true
        //     };
        //     if (card.y < 0) {
        //         this.cardGroup.remove(card)
        //     };
        // }, this);                 

        this.game.physics.arcade.overlap(this.player,this.master, function () {
            this.quitGame();
        }, null, this); //与master碰撞     
    },

    quitGame: function (pointer) {
        this.bRunBg = true
        this.offsetY = 0
        this.state.start('MainMenu');
    },
    render: function () {
        // this.game.debug.spriteInfo(this.game, 64, 64);
    },

    createEnemy: function () {
        // 暂时有敌人障碍，不出现先障碍
        if (this.bRunBg == false) { return };

        var type = this.game.rnd.integerInRange(1, 4);
        type = 5
        //石墙
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
            this.fenceGroup.setAll('body.gravity.y', -60);                    
        };

        //飞鸟
        if (type == 2) {
            if (this.birdGroup.length > 0) {return};

            var bird = this.game.add.sprite(this.game.width, this.game.height+80, 'bird', null, this.birdGroup);
            // this.game.add.tween(bird).to({ x: 0 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 
            var tweenBird = this.game.add.tween(bird)
            tweenBird.to({ x: 0 }, 4000, Phaser.Easing.Quadratic.InOut); 
            tweenBird.start();
            tweenBird.onComplete.addOnce(function () {
                bird.angle += 180
                var tweenBird = this.game.add.tween(bird)
                tweenBird.to({ x: this.game.width }, 4000, Phaser.Easing.Quadratic.InOut); 
                tweenBird.start();
                tweenBird.onComplete.addOnce(function () {
                    bird.angle -= 180
                    var tweenBird = this.game.add.tween(bird)
                    tweenBird.to({ x: 0 }, 4000, Phaser.Easing.Quadratic.InOut); 
                    tweenBird.start();
                    tweenBird.onComplete.addOnce(function () {
                        bird.angle += 180
                    }, this);                                     
                }, this);                    
            }, this);
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
            this.birdGroup.setAll('body.gravity.y', -60);                     
        };

        //箭头
        if (type == 3) {
            if (this.arrowGroup.length > 0) {return};

            var typeArrow = this.game.rnd.integerInRange(1, 2);
            var perX

            var arrow = this.game.add.sprite(this.game.width/2, this.game.height+80, 'arrow', null, this.arrowGroup);
            arrow.anchor.set(0.5)
            arrow.scale.set(4)
            if (typeArrow == 1) {arrow.angle = 180};
            arrow.inputEnabled = true;
            arrow.input.allowHorizontalDrag = true;
            arrow.input.allowVerticalDrag = false;            
            arrow.input.enableDrag();
            arrow.events.onDragStart.add(function () {
                perX = arrow.x
            }, this);
            arrow.events.onDragUpdate.add(function () {
                if (typeArrow == 1) {
                    if ((arrow.x - perX) > 0) {arrow.x = perX};
                    if (Math.abs(arrow.x - perX) >= 80) {
                        var tweenArrow = this.game.add.tween(arrow)
                        tweenArrow.to({ x: -500 }, 1000, Phaser.Easing.Quadratic.InOut); 
                        tweenArrow.start();
                        tweenArrow.onComplete.addOnce(function () {
                            arrow.kill()
                            this.arrowGroup.remove(arrow)
                        }, this);           
                        this.bRunBg = true;
                    };                    

                } else{
                    if ((arrow.x - perX) < 0) {arrow.x = perX};
                    if (Math.abs(arrow.x - perX) >= 80) {
                        var tweenArrow = this.game.add.tween(arrow)
                        tweenArrow.to({ x: this.game.width+500 }, 1000, Phaser.Easing.Quadratic.InOut); 
                        tweenArrow.start();
                        tweenArrow.onComplete.addOnce(function () {
                            arrow.kill()
                            this.arrowGroup.remove(arrow)
                        }, this);           
                        this.bRunBg = true;
                    };
                };
            }, this);  

            var typeArrow1 = this.game.rnd.integerInRange(1, 2);
            var perX1

            var arrow1 = this.game.add.sprite(this.game.width/2, this.game.height+140, 'arrow', null, this.arrowGroup);
            arrow1.anchor.set(0.5)
            arrow1.scale.set(4)
            if (typeArrow1 == 1) {arrow1.angle = 180};
            arrow1.inputEnabled = true;
            arrow1.input.allowHorizontalDrag = true;
            arrow1.input.allowVerticalDrag = false;            
            arrow1.input.enableDrag();
            arrow1.events.onDragStart.add(function () {
                perX1 = arrow1.x
            }, this);
            arrow1.events.onDragUpdate.add(function () {
                if (typeArrow1 == 1) {
                    if ((arrow1.x - perX1) > 0) {arrow1.x = perX1};
                    if (Math.abs(arrow1.x - perX1) >= 80) {
                        var tweenArrow1 = this.game.add.tween(arrow1)
                        tweenArrow1.to({ x: -500 }, 1000, Phaser.Easing.Quadratic.InOut); 
                        tweenArrow1.start();
                        tweenArrow1.onComplete.addOnce(function () {
                            arrow1.kill()
                            this.arrowGroup.remove(arrow1)
                        }, this);           
                        this.bRunBg = true;
                    };                    

                } else{
                    if ((arrow1.x - perX1) < 0) {arrow1.x = perX1};
                    if (Math.abs(arrow1.x - perX1) >= 80) {
                        var tweenArrow1 = this.game.add.tween(arrow1)
                        tweenArrow1.to({ x: this.game.width+500 }, 1000, Phaser.Easing.Quadratic.InOut); 
                        tweenArrow1.start();
                        tweenArrow1.onComplete.addOnce(function () {
                            arrow1.kill()
                            this.arrowGroup.remove(arrow1)
                        }, this);           
                        this.bRunBg = true;
                    };
                };
            }, this);              

            this.arrowGroup.setAll('outOfBoundsKill',true);
            this.arrowGroup.setAll('body.gravity.y', -60);
        };    

        //左右锁
        if (type == 4) {
            if (this.lockGroup.length > 0) {return};

            var locks = ['lock','lock1']
            var keys = ['key','key1']

            var lockType = this.game.rnd.integerInRange(0, 1)
            var lock = this.game.add.sprite(this.game.width/2, this.game.height+150, locks[lockType], null, this.lockGroup);
            lock.anchor.set(0.5)
            lock.scale.set(0.4)

            var keyTypeL = this.game.rnd.integerInRange(0, 1)
            var keyL = this.game.add.sprite(0, this.game.height+80, keys[keyTypeL], null, this.lockGroup);
            keyL.anchor.set(0.5)
            keyL.scale.set(0.4)           
            keyL.inputEnabled = true;           
            keyL.input.enableDrag();
            var interacteFunc = function  () {
                if (Phaser.Rectangle.intersects(lock.getBounds(), keyL.getBounds())) {
                    if (lockType == keyTypeL) {
                        lock.kill();
                        keyL.kill();
                        keyR.kill();
                        this.bRunBg = true;
                        this.lockGroup.remove(lock);
                        this.lockGroup.remove(keyL);
                        this.lockGroup.remove(keyR);
                    } else{
                        keyL.kill();
                        this.lockGroup.remove(keyL);
                    };
                };
            }
            keyL.events.onDragUpdate.add(interacteFunc,this);  
            keyL.events.onDragStop.add(interacteFunc,this);  

            if (keyTypeL == 0) {keyTypeR = 1} else{keyTypeR = 0};
            var keyR = this.game.add.sprite(this.game.width, this.game.height+80, keys[keyTypeR], null, this.lockGroup);
            keyR.anchor.set(0.5)
            keyR.scale.set(0.4)              
            keyR.inputEnabled = true;           
            keyR.input.enableDrag();
            var interacteFuncR = function  () {
                if (Phaser.Rectangle.intersects(lock.getBounds(), keyR.getBounds())) {
                    if (lockType == keyTypeR) {
                        lock.kill();
                        keyL.kill();
                        keyR.kill();
                        this.bRunBg = true;
                        this.lockGroup.remove(lock);
                        this.lockGroup.remove(keyL);
                        this.lockGroup.remove(keyR);
                    } else{
                        keyR.kill();
                        this.lockGroup.remove(keyR);
                    };
                };
            }
            keyR.events.onDragUpdate.add(interacteFuncR, this);             
            keyR.events.onDragStop.add(interacteFuncR, this);             

            this.lockGroup.setAll('outOfBoundsKill',true);
            this.lockGroup.setAll('body.gravity.y', -60);
        }; 

        //猜卡牌
        if (type == 5) {
            if (this.cardGroup.length > 0) {return};

            var poss = [this.game.width/4*1,this.game.width/4*2,this.game.width/4*3]

            var card1 = this.game.add.sprite(poss[0], this.game.height+80, 'dika', null, this.cardGroup);
            card1.anchor.set(0.5)
            card1.inputEnabled = true;
            card1.events.onInputDown.add(function  () {
                Shuffle(card1)
            }, this); 
            var card2 = this.game.add.sprite(poss[1], this.game.height+80, 'dika', null, this.cardGroup);
            card2.anchor.set(0.5)
            card2.inputEnabled = true;
            card2.events.onInputDown.add(function  () {
                Shuffle(card2)
            }, this); 
            var card3 = this.game.add.sprite(poss[2], this.game.height+80, 'dika', null, this.cardGroup);
            card3.anchor.set(0.5)
            card3.inputEnabled = true;
            card3.events.onInputDown.add(function  () {
                Shuffle(card3)
            }, this);            

            var trueSpr = this.game.make.sprite(0,0,'card_26')
            trueSpr.anchor.set(0.5)
            trueSpr.scale.set(0.4)  
            // var cardidx = this.game.rnd.integerInRange(0,2)           
            card1.addChild(trueSpr)
            card1.trueSpr = trueSpr

            var Shuffle = function (card) {
                if (card.trueSpr) {
                    this.bRunBg = true;
                    card1.kill();
                    card2.kill();
                    card3.kill();
                    // this.cardGroup.removeAll(true)
                } else{
                    poss = Phaser.ArrayUtils.shuffle(poss)
                    card1.x = poss[0]
                    card2.x = poss[1]
                    card3.x = poss[2]
                };
            }            

            this.cardGroup.setAll('outOfBoundsKill',true);
            this.cardGroup.setAll('body.gravity.y', -60);                      
        };        
    },
};
