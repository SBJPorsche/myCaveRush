
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

var betadirection=0,gammadirection=0,alphadirection=0;
var playerRotation = 0
function deviceOrientationListener(event) {
  alphadirection = Math.round(event.alpha);
  betadirection = Math.round(event.beta);
  gammadirection = Math.round(event.gamma);
}
  
if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", deviceOrientationListener);
} else {
        alert("您使用的浏览器不支持Device Orientation特性");
}
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

        this.mathGroup = this.game.add.group();
        this.mathGroup.enableBody = true; 

        this.diffGroup = this.game.add.group();
        this.diffGroup.enableBody = true;    

        this.rotateGroup = this.game.add.group();
        this.rotateGroup.enableBody = true;                                               

        this.player = new BasicGame.Player(this.game, this.game.width/2, this.game.height/2-200)
        this.game.add.existing(this.player);    

        this.master = this.game.add.sprite(this.game.width/2,-300,'master')
        this.master.anchor.set(0.5) 
        this.game.physics.enable(this.master, Phaser.Physics.ARCADE); 
        this.game.time.events.loop(Phaser.Timer.SECOND, function () {
            if (this.bRunBg == true) {
                this.masterGo(2)
            };
        }, this);   

        this.style = {font: '25px Arial', fill: '#ffffff', align: 'center', fontWeight: 'bold', stroke: '#000000', strokeThickness: 6};
        this.scoreText = this.game.add.text(this.game.width-100, 100, "0", this.style);
        this.scoreText.anchor.set(0.5); 

        this.masterDistance = this.game.add.text(100, 100,'0', this.style);
        this.masterDistance.anchor.set(0.5);                  

        this.testtext = this.game.add.text(100, 300,0, this.style);
        this.testtext.anchor.set(0.5);       

        this.game.time.events.loop(Phaser.Timer.SECOND, this.createEnemy, this);   
        this.game.time.events.start();       
    },

    update: function () {
        if (gammadirection>20 || gammadirection<-20) {
            this.player.angle = gammadirection 
        }else{
            this.player.angle = 0
        };
        if (betadirection>60) {
            this.player.angle = 180
        };
        playerRotation = Math.ceil((this.player.angle+360)%360)

        this.scoreText.text = this.bg.distance

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
        this.cardGroup.forEachExists(function(card){
            if (this.bRunBg == false) {
                card.body.moves = false
            }else{
                card.body.moves = true
            };
            if (card.y < 0) {
                this.cardGroup.remove(card)
            };
        }, this);     

        //与math碰撞
        this.game.physics.arcade.overlap(this.player,this.mathGroup, function () {
            this.bRunBg = false
        }, null, this); 
        this.mathGroup.forEachExists(function(math){
            if (this.bRunBg == false) {
                math.body.moves = false
            }else{
                math.body.moves = true
            };
            if (math.y < 0) {
                this.mathGroup.remove(math)
            };
        }, this);                     

        //与diff碰撞
        this.game.physics.arcade.overlap(this.player,this.diffGroup, function () {
            this.bRunBg = false
        }, null, this); 
        this.diffGroup.forEachExists(function(math){
            if (this.bRunBg == false) {
                math.body.moves = false
            }else{
                math.body.moves = true
            };
            if (math.y < 0) {
                this.diffGroup.remove(math)
            };
        }, this); 

        //与rotate碰撞
        this.game.physics.arcade.overlap(this.player,this.rotateGroup, function () {
            this.bRunBg = false
        }, null, this); 
        this.rotateGroup.forEachExists(function(math){
            if (this.bRunBg == false) {
                math.body.moves = false
            }else{
                math.body.moves = true
            };
            if (math.y < 0) {
                this.rotateGroup.remove(math)
            };
        }, this);         

        this.game.physics.arcade.overlap(this.player,this.master, function () {
            this.quitGame();
        }, null, this); //与master碰撞   
         
        if (this.bRunBg == false) {
            // if (this.master.y > 0) {
            //     this.master.y = this.master.y + 1 + this.offsetY // 怪物逼近
            //     this.offsetY += 0.1
            // } else{
            //     this.master.y = this.master.y + 1 // 怪物逼近
            // };
        } else{
            this.bg.updateBg()// 刷新背景图
        };         
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

        var type = this.game.rnd.integerInRange(1, 8);
        // type = 8
        var initpos = 180
        var enemyspeed = -80
        //石墙
        if (type == 1) {
            if (this.fenceGroup.length > 0) {return};

            var fence = this.game.add.sprite(this.game.width/2, this.game.height+initpos, 'fence', null, this.fenceGroup);
            fence.anchor.set(0.5)
            fence.scale.x = 4
            fence.inputEnabled = true;
            fence.events.onInputDown.add(function  () {
                fence.kill()
                this.fenceGroup.remove(fence)
                // this.bRunBg = true;
            }, this); 
            this.fenceGroup.setAll('outOfBoundsKill',true);
            this.fenceGroup.setAll('body.gravity.y', enemyspeed);                    
        };

        //飞鸟
        if (type == 2) {
            if (this.birdGroup.length > 0) {return};

            var bird = this.game.add.sprite(this.game.width-200, this.game.height+initpos, 'bird', null, this.birdGroup);
            this.game.add.tween(bird).to({ x: 200 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 
            bird.anchor.set(0.5)
            bird.animations.add('fly');
            bird.animations.play('fly', 30, true);
            bird.scale.set(1.2)     
            bird.inputEnabled = true;
            bird.events.onInputDown.add(function  () {
                bird.kill()
                this.birdGroup.remove(bird)
                // this.bRunBg = true;
            }, this); 
            this.birdGroup.setAll('outOfBoundsKill',true);
            this.birdGroup.setAll('body.gravity.y', enemyspeed);                     
        };

        //箭头
        if (type == 3) {
            if (this.arrowGroup.length > 0) {return};

            var typeArrow = this.game.rnd.integerInRange(1, 2);
            var perX

            var arrow = this.game.add.sprite(this.game.width/2, this.game.height+initpos, 'arrow', null, this.arrowGroup);
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
                        // this.bRunBg = true;
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
                        // this.bRunBg = true;
                    };
                };
            }, this);  

            var typeArrow1 = this.game.rnd.integerInRange(1, 2);
            var perX1

            var arrow1 = this.game.add.sprite(this.game.width/2, this.game.height+initpos+100, 'arrow', null, this.arrowGroup);
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
                        // this.bRunBg = true;
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
                        // this.bRunBg = true;
                    };
                };
            }, this);              

            this.arrowGroup.setAll('outOfBoundsKill',true);
            this.arrowGroup.setAll('body.gravity.y', enemyspeed);
        };    

        //左右锁
        if (type == 4) {
            if (this.lockGroup.length > 0) {return};

            var locks = ['lock','lock1']
            var keys = ['key','key1']

            var lockType = this.game.rnd.integerInRange(0, 1)
            var lock = this.game.add.sprite(this.game.width/2, this.game.height+initpos+70, locks[lockType], null, this.lockGroup);
            lock.anchor.set(0.5)
            lock.scale.set(0.4)

            var keyTypeL = this.game.rnd.integerInRange(0, 1)
            var keyL = this.game.add.sprite(0, this.game.height+initpos, keys[keyTypeL], null, this.lockGroup);
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
                        // this.bRunBg = true;
                        this.lockGroup.remove(lock);
                        this.lockGroup.remove(keyL);
                        this.lockGroup.remove(keyR);
                    } else{
                        this.masterGo(50)
                        keyL.kill();
                        this.lockGroup.remove(keyL);
                    };
                };
            }
            keyL.events.onDragUpdate.add(interacteFunc,this);  
            keyL.events.onDragStop.add(interacteFunc,this);  

            if (keyTypeL == 0) {keyTypeR = 1} else{keyTypeR = 0};
            var keyR = this.game.add.sprite(this.game.width, this.game.height+initpos, keys[keyTypeR], null, this.lockGroup);
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
                        // this.bRunBg = true;
                        this.lockGroup.remove(lock);
                        this.lockGroup.remove(keyL);
                        this.lockGroup.remove(keyR);
                    } else{
                        this.masterGo(50)
                        keyR.kill();
                        this.lockGroup.remove(keyR);
                    };
                };
            }
            keyR.events.onDragUpdate.add(interacteFuncR, this);             
            keyR.events.onDragStop.add(interacteFuncR, this);             

            this.lockGroup.setAll('outOfBoundsKill',true);
            this.lockGroup.setAll('body.gravity.y', enemyspeed);
        }; 

        //猜卡牌
        if (type == 5) {
            if (this.cardGroup.length > 0) {return};

            var poss = [this.game.width/4*1,this.game.width/4*2,this.game.width/4*3]
            var cards = ['card_26','card_28','card_38']
            cards = Phaser.ArrayUtils.shuffle(cards)

            var cardBase = this.game.add.sprite(poss[2], this.game.height+initpos, cards[0], null, this.cardGroup);
            cardBase.anchor.set(0.5)
            cardBase.scale.set(0.4)  
            this.game.add.tween(cardBase).to({ alpha: 0 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 

            var card1 = this.game.add.sprite(poss[0], this.game.height+300, cards[0], null, this.cardGroup);
            card1.anchor.set(0.5)
            card1.scale.set(0.4)
            card1.inputEnabled = true;
            card1.events.onInputDown.add(function  () {
                cardBase.kill();
                card1.kill();
                card2.kill();
                card3.kill();
                // this.bRunBg = true;
                this.cardGroup.remove(cardBase)
                this.cardGroup.remove(card1)
                this.cardGroup.remove(card2)
                this.cardGroup.remove(card3)                
            }, this); 
            var card2 = this.game.add.sprite(poss[1], this.game.height+300, cards[1], null, this.cardGroup);
            card2.anchor.set(0.5)
            card2.scale.set(0.4)            
            var card3 = this.game.add.sprite(poss[2], this.game.height+300, cards[2], null, this.cardGroup);
            card3.anchor.set(0.5)
            card3.scale.set(0.4)  
            this.game.time.events.loop(Phaser.Timer.SECOND*1.2, function () {
                poss = Phaser.ArrayUtils.shuffle(poss)
                card1.x = poss[0]
                card2.x = poss[1]
                card3.x = poss[2]                                   
            }, this);            

            this.cardGroup.setAll('outOfBoundsKill',true);
            this.cardGroup.setAll('body.gravity.y', enemyspeed);                      
        }; 

        //数学板
        if (type == 6) {
            if (this.mathGroup.length > 0) {return};

            var textshow
            var right = false
            var initbord = function () {
                var a = Math.ceil(Math.random()*500)
                var b = Math.ceil(Math.random()*500)
                var arr = ['+','-']
                var subs = [-100,-10,0,10,100,0,0]
                subs = Phaser.ArrayUtils.shuffle(subs)
                var sub = subs[0]
                var sum = a+b+sub
                if (sub == 0) {
                    right = true
                };
                var str = a+arr[0]+b+'='+sum
                textshow.text = str
            }

            var mathBord = this.game.add.sprite(this.game.width/2, this.game.height+initpos, 'fence', null, this.mathGroup);
            mathBord.anchor.set(0.5)
            mathBord.scale.set(4,2) 

            textshow = this.game.make.text(0, 0, "0", this.style);
            mathBord.addChild(textshow);
            textshow.anchor.set(0.5);
            textshow.scale.set(0.5,1) 
            initbord()
            
            var yes = this.game.make.button(0,0, 'yes',function () {
                if (right == true) {
                    mathBord.kill();
                    // this.bRunBg = true;
                    this.mathGroup.remove(mathBord)
                } else{
                    this.masterGo(50)
                    initbord()
                };
            }, this, 2, 1, 0)
            mathBord.addChild(yes);
            yes.scale.set(0.5,1)
            yes.x = 50
            yes.y = 0

            var no = this.game.make.button(0,0, 'no',function () {
                if (right == false) {
                    mathBord.kill();
                    // this.bRunBg = true;
                    this.mathGroup.remove(mathBord)
                } else{
                    this.masterGo(50)
                    initbord()
                };
            }, this, 2, 1, 0)
            mathBord.addChild(no);            
            no.scale.set(0.5,1)
            no.x = -80
            no.y = 0            

            this.mathGroup.setAll('outOfBoundsKill',true);
            this.mathGroup.setAll('body.gravity.y', enemyspeed);    
        };    

        //找不同
        if (type == 7) {
            if (this.diffGroup.length > 0) {return};

            var pics = []
            for (var i = 0; i < 9; i++) {
                if (i < 8) {
                    pics[i] = 'yes'
                } else{
                    pics[i] = 'no'
                };
            };

            var poss = [
                        [-30,-30],[0,-30],[30,-30],
                        [-30,0],[0,0],[30,0],
                        [-30,30],[0,30],[30,30]
                        ]
            poss = Phaser.ArrayUtils.shuffle(poss)

            var diffBord = this.game.add.sprite(this.game.width/2, this.game.height+initpos+200, 'background', null, this.diffGroup);
            diffBord.anchor.set(0.5)
            diffBord.scale.set(4) 

            for (var i = 0; i < pics.length; i++) {
                var btn
                if (i < 8) {
                    btn = this.game.make.button(0,0, pics[i],function () {
                        this.masterGo(50)
                    }, this, 2, 1, 0)
                } else{
                    btn = this.game.make.button(0,0, pics[i],function () {
                        this.masterBack(30)
                        diffBord.kill();
                        // this.bRunBg = true;
                        this.diffGroup.remove(diffBord)
                    }, this, 2, 1, 0)
                };
                diffBord.addChild(btn);
                btn.anchor.set(0.5)
                btn.scale.set(0.5)
                btn.x = poss[i][0]
                btn.y = poss[i][1]            
            };        

            this.diffGroup.setAll('outOfBoundsKill',true);
            this.diffGroup.setAll('body.gravity.y', enemyspeed);    
        };    

        //主角旋转
        if (type == 8) {
            if (this.rotateGroup.length > 0) {return};

            var playerBord = this.game.add.sprite(this.game.width/2, this.game.height+initpos, 'player', null, this.rotateGroup);
            playerBord.anchor.set(0.5)
            playerBord.scale.set(1) 

            var angles = [300,315,330,0,30,45,60,180]
            angles = Phaser.ArrayUtils.shuffle(angles)
            playerBord.angle = angles[0]
            this.game.time.events.loop(Phaser.Timer.SECOND/60, function () {
                if (playerRotation == angles[0]) {
                    playerBord.kill();
                    // this.bRunBg = true;
                    this.rotateGroup.remove(playerBord)
                };
            }, this);        

            this.rotateGroup.setAll('outOfBoundsKill',true);
            this.rotateGroup.setAll('body.gravity.y', enemyspeed);    
        };                  
    },

    masterGo:function (distance) {
        distance = distance || 20
        var toY = this.master.y + distance
        var tweenMaster = this.game.add.tween(this.master)
        tweenMaster.to({ y: toY }, 4000, Phaser.Easing.Quadratic.InOut); 
        tweenMaster.start();
    },

    masterBack:function (distance) {
        distance = distance || 20
        var toY = this.master.y - distance
        var tweenMaster = this.game.add.tween(this.master)
        tweenMaster.to({ y: toY }, 4000, Phaser.Easing.Quadratic.InOut); 
        tweenMaster.start();        
    },

    playerGo:function (distance) {
        distance = distance || 20
        var toY = this.player.y + distance
        var tweenplayer = this.game.add.tween(this.player)
        tweenplayer.to({ y: toY }, 4000, Phaser.Easing.Quadratic.InOut); 
        tweenplayer.start();
    },

    playerBack:function (distance) {
        distance = distance || 20
        var toY = this.player.y - distance
        var tweenplayer = this.game.add.tween(this.player)
        tweenplayer.to({ y: toY }, 4000, Phaser.Easing.Quadratic.InOut); 
        tweenplayer.start();        
    },    
};
