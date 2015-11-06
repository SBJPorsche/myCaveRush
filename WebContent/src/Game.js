
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
    this.gamespeed = -80

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

var bPlayerShade = false
// 首先，定义一个摇动的阀值
var SHAKE_THRESHOLD = 3000;
// 定义一个变量保存上次更新的时间
var last_update = 0;
// 紧接着定义x、y、z记录三个轴的数据以及上一次出发的时间
var x;
var y;
var z;
var last_x;
var last_y;
var last_z;

// 为了增加这个例子的一点无聊趣味性，增加一个计数器
var count = 0;

function deviceMotionHandler(eventdata) {
    var acceleration = eventdata.accelerationIncludingGravity
    var curtime = new Date().getTime()
    var difftime = curtime - last_update
    if (difftime > 100) {
        last_update = curtime
        x = acceleration.x
        y = acceleration.y
        z = acceleration.z

        var speed = Math.abs(x + y + z - last_x - last_y - last_z)/ difftime * 10000; 
        if (speed > SHAKE_THRESHOLD) {
            bPlayerShade = true
        }else{
            bPlayerShade = false
        };
        last_x = x
        last_y = y
        last_z = z
    };   
}
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler);
} else{
    alert("移动浏览器不支持运动传感事件 ");
};

BasicGame.Game.prototype = {
    create: function () {
        this.bg = new BasicGame.BackGround(this.game)
        this.game.add.existing(this.bg);

        this.killGroup = this.game.add.group();
        this.killGroup.enableBody = true;       

        this.hitGroup = this.game.add.group();
        this.hitGroup.enableBody = true;            

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
        this.testtext1 = this.game.add.text(100, 500,0, this.style);
        this.testtext1.anchor.set(0.5);              

        this.game.time.events.loop(Phaser.Timer.SECOND*10, function () {
            if (this.hitGroup.length+this.killGroup.length > 1) { return };
            var newY = this.game.height
            for (var i = 0; i < 3; i++) {
               newY = this.createEnemy(newY) 
            };
        }, this);   
        this.game.time.events.start();       
    },

    update: function () {
        // 手机感应
        if (gammadirection>20 || gammadirection<-20) {
            this.player.angle = gammadirection 
        }else{
            this.player.angle = 0
        };
        if (betadirection>60) {
            this.player.angle = 180
        };
        playerRotation = Math.ceil((this.player.angle+360)%360)

        //数值
        this.scoreText.text = this.bg.distance
        this.testtext1.text = this.bRunBg
        this.testtext.text = this.hitGroup.length+this.killGroup.length
        // this.testtext.text = bPlayerShade
        var twoheight = this.master.height/2+this.player.height/2
        this.masterDistance.text = Math.max(Math.ceil(this.game.physics.arcade.distanceBetween(this.master,this.player)-twoheight),0)

        //与master碰撞
        this.game.physics.arcade.overlap(this.player,this.master, function () {
            this.quitGame();
        }, null, this);           
        //与killitem碰撞
        this.game.physics.arcade.collide(this.player,this.killGroup, function () {
            this.quitGame();
        }, null, this); 
        //与hititem碰撞  
        this.game.physics.arcade.collide(this.player,this.hitGroup, function () {
            this.bRunBg = false
        }, null, this); 

        this.killGroup.forEachExists(function(item){
            if (this.bRunBg == false) {
                item.body.moves = false
            }else{
                item.body.moves = true
            };            
            if (item.y < 0) {
                this.killGroup.remove(item)
            };
        }, this);         
        
        this.hitGroup.forEachExists(function(item){
            if (this.bRunBg == false) {
                item.body.moves = false
            }else{
                item.body.moves = true
            };            
            if (item.y < 0) {
                item.kill();
                this.hitGroup.remove(item)
            };
        }, this); 

        if (this.bRunBg == false) {
            // if (this.master.y > 0) {
            //     this.master.y = this.master.y + 1 + this.offsetY // 怪物逼近
            //     this.offsetY += 0.2
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

    createEnemy: function (y) {
        // 暂时有敌人障碍，不出现先障碍
        var nextEnemyY = 0
        var type = this.game.rnd.integerInRange(1, 8);
        // type = 1
        //石墙
        if (type == 1) {
            nextEnemyY = y+200 // 80是enemy高度
            var fence = this.game.add.sprite(this.game.width/2, y+200, 'fence', null, this.hitGroup);
            fence.anchor.set(0.5)
            fence.scale.x = 4
            fence.inputEnabled = true;
            fence.events.onInputDown.add(function  () {
                if (this.hitGroup.getFirstAlive() == fence) {
                    this.bRunBg = true;
                };
                this.hitGroup.remove(fence)
                fence.kill()
            }, this);  
            this.hitGroup.setAll('body.gravity.y', this.gamespeed);     
            this.hitGroup.setAll('body.moves', false);                              

        };

        //飞鸟
        if (type == 2) {
            nextEnemyY = y+200 // 80是enemy高度
            var bird = this.game.add.sprite(this.game.width-200, y+200, 'bird', null, this.killGroup);
            this.game.add.tween(bird).to({ x: 200 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 
            bird.anchor.set(0.5)
            bird.animations.add('fly');
            bird.animations.play('fly', 30, true);
            bird.scale.set(1.2)     
            bird.inputEnabled = true;
            bird.events.onInputDown.add(function  () {
                this.killGroup.remove(bird)
                bird.kill()
            }, this); 
            this.killGroup.setAll('body.gravity.y', this.gamespeed);    
            this.killGroup.setAll('body.moves', false);                              

        };

        //箭头
        if (type == 3) {
            nextEnemyY = y+200 // 80是enemy高度
            var typeArrow = this.game.rnd.integerInRange(1, 2);
            var perX

            var arrow = this.game.add.sprite(this.game.width/2, y+200, 'arrow', null, this.hitGroup);
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
                            if (this.hitGroup.getFirstAlive() == arrow) {
                                this.bRunBg = true;
                            };
                            this.hitGroup.remove(arrow)
                            arrow.kill()
                        }, this);           
                    };                    

                } else{
                    if ((arrow.x - perX) < 0) {arrow.x = perX};
                    if (Math.abs(arrow.x - perX) >= 80) {
                        var tweenArrow = this.game.add.tween(arrow)
                        tweenArrow.to({ x: this.game.width+500 }, 1000, Phaser.Easing.Quadratic.InOut); 
                        tweenArrow.start();
                        tweenArrow.onComplete.addOnce(function () {
                            if (this.hitGroup.getFirstAlive() == arrow) {
                                this.bRunBg = true;
                            };
                            this.hitGroup.remove(arrow)
                            arrow.kill()
                        }, this);           
                    };
                };
            }, this);  
            this.hitGroup.setAll('body.gravity.y', this.gamespeed);                              
            this.hitGroup.setAll('body.moves', false);                              
        };    

        //左右锁
        if (type == 4) {
            nextEnemyY = y+400 // 80是enemy高度
            var locks = ['lock','lock1']
            var keys = ['key','key1']

            var lockType = this.game.rnd.integerInRange(0, 1)
            var lock = this.game.add.sprite(this.game.width/2, y+400, locks[lockType], null, this.hitGroup);
            lock.anchor.set(0.5)

            var keyTypeL = this.game.rnd.integerInRange(0, 1)
            var keyL = this.game.make.sprite(-300, 100, keys[keyTypeL]);
            lock.addChild(keyL);
            keyL.anchor.set(0.5)
            keyL.inputEnabled = true;           
            keyL.input.enableDrag();
            var interacteFunc = function  () {
                if (Phaser.Rectangle.intersects(lock.getBounds(), keyL.getBounds())) {
                    if (lockType == keyTypeL) {
                        if (this.hitGroup.getFirstAlive() == lock) {
                            this.bRunBg = true;
                        };
                        this.hitGroup.remove(lock);
                        lock.kill();
                    } else{
                        this.masterGo(50)
                        keyL.kill();
                    };
                };
            }
            keyL.events.onDragUpdate.add(interacteFunc,this);  
            keyL.events.onDragStop.add(interacteFunc,this);  

            if (keyTypeL == 0) {keyTypeR = 1} else{keyTypeR = 0};
            var keyR = this.game.make.sprite(300, 100, keys[keyTypeR]);
            lock.addChild(keyR);
            keyR.anchor.set(0.5)
            keyR.inputEnabled = true;           
            keyR.input.enableDrag();
            var interacteFuncR = function  () {
                if (Phaser.Rectangle.intersects(lock.getBounds(), keyR.getBounds())) {
                    if (lockType == keyTypeR) {
                        if (this.hitGroup.getFirstAlive() == lock) {
                            this.bRunBg = true;
                        };
                        this.hitGroup.remove(lock);
                        lock.kill();
                    } else{
                        this.masterGo(50)
                        keyR.kill();
                    };
                };
            }
            keyR.events.onDragUpdate.add(interacteFuncR, this);             
            keyR.events.onDragStop.add(interacteFuncR, this);   
            this.hitGroup.setAll('body.gravity.y', this.gamespeed); 
            this.hitGroup.setAll('body.moves', false);                              

        }; 

        //猜卡牌
        if (type == 5) {
            nextEnemyY = y+1000 // 80是enemy高度
            var poss = [-300,0,300]
            var cards = ['card_26','card_28','card_38']
            cards = Phaser.ArrayUtils.shuffle(cards)

            var cardBase = this.game.add.sprite(this.game.width/2, y+1000, cards[0], null, this.hitGroup);
            cardBase.anchor.set(0.5)
            cardBase.scale.set(0.4)  
            // this.game.add.tween(cardBase).to({ alpha: 0 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 

            var card1 = this.game.add.sprite(poss[0], 300, cards[0]);
            cardBase.addChild(card1);
            card1.anchor.set(0.5)
            card1.inputEnabled = true;
            card1.events.onInputDown.add(function  () {
                if (this.hitGroup.getFirstAlive() == cardBase) {
                    this.bRunBg = true;
                };
                this.hitGroup.remove(cardBase)                
                cardBase.kill();
            }, this); 
            var card2 = this.game.add.sprite(poss[1], 300, cards[1]);
            cardBase.addChild(card2);
            card2.anchor.set(0.5)
            var card3 = this.game.add.sprite(poss[2], 300, cards[2]);
            cardBase.addChild(card3);
            card3.anchor.set(0.5)
            this.game.time.events.loop(Phaser.Timer.SECOND, function () {
                poss = Phaser.ArrayUtils.shuffle(poss)
                card1.x = poss[0]
                card2.x = poss[1]
                card3.x = poss[2]                                   
            }, this);  
            this.hitGroup.setAll('body.gravity.y', this.gamespeed);   
            this.hitGroup.setAll('body.moves', false);                              

        }; 

        //数学板
        if (type == 6) {
            nextEnemyY = y+300 // 80是enemy高度
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

            var mathBord = this.game.add.sprite(this.game.width/2, y+300, 'fence', null, this.hitGroup);
            mathBord.anchor.set(0.5)
            mathBord.scale.set(4,2) 

            textshow = this.game.make.text(0, 0, "0", this.style);
            mathBord.addChild(textshow);
            textshow.anchor.set(0.5);
            textshow.scale.set(0.5,1) 
            initbord()
            
            var yes = this.game.make.button(0,0, 'yes',function () {
                if (right == true) {
                    if (this.hitGroup.getFirstAlive() == mathBord) {
                        this.bRunBg = true;
                    };
                    this.hitGroup.remove(mathBord)
                    mathBord.kill();
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
                    if (this.hitGroup.getFirstAlive() == mathBord) {
                        this.bRunBg = true;
                    };
                    this.hitGroup.remove(mathBord)
                    mathBord.kill();
                } else{
                    this.masterGo(50)
                    initbord()
                };
            }, this, 2, 1, 0)
            mathBord.addChild(no);            
            no.scale.set(0.5,1)
            no.x = -80
            no.y = 0     
            this.hitGroup.setAll('body.gravity.y', this.gamespeed); 
            this.hitGroup.setAll('body.moves', false);                              

        };    

        //找不同
        if (type == 7) {
            nextEnemyY = y+600 // 80是enemy高度
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

            var diffBord = this.game.add.sprite(this.game.width/2, y+600, 'background', null, this.hitGroup);
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
                        if (this.hitGroup.getFirstAlive() == diffBord) {
                            this.bRunBg = true;
                        };
                        this.hitGroup.remove(diffBord)
                        diffBord.kill();
                    }, this, 2, 1, 0)
                };
                diffBord.addChild(btn);
                btn.anchor.set(0.5)
                btn.scale.set(0.5)
                btn.x = poss[i][0]
                btn.y = poss[i][1]            
            }; 
            this.hitGroup.setAll('body.gravity.y', this.gamespeed);   
            this.hitGroup.setAll('body.moves', false);                              

        };    

        //主角旋转
        if (type == 8) {
            nextEnemyY = y+150 // 80是enemy高度
            var playerBord = this.game.add.sprite(this.game.width/2, y+150, 'player', null, this.hitGroup);
            playerBord.anchor.set(0.5)
            playerBord.scale.set(1) 

            var angles = [300,315,330,0,30,45,60,180]
            angles = Phaser.ArrayUtils.shuffle(angles)
            playerBord.angle = angles[0]
            this.game.time.events.loop(Phaser.Timer.SECOND/60, function () {
                if (playerRotation == angles[0]) {
                    if (this.hitGroup.getFirstAlive() == playerBord) {
                        this.bRunBg = true;
                    };
                    this.hitGroup.remove(playerBord)
                    playerBord.kill();
                };
            }, this);   
            this.hitGroup.setAll('body.gravity.y', this.gamespeed);                        
            this.hitGroup.setAll('body.moves', false);                              

        };  

        return nextEnemyY;                
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
