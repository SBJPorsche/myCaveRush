
BasicGame.Game = function (game) {
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
};

var maxFuelCnt = 4
var maxPortalCnt = 4
var betadirection=0,gammadirection=0,alphadirection=0;
var playerRotation = 0
var surportRotation = true
function deviceOrientationListener(event) {
  alphadirection = Math.round(event.alpha);
  betadirection = Math.round(event.beta);
  gammadirection = Math.round(event.gamma);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationListener);
} else {
    surportRotation = false
    alert("您使用的浏览器不支持Device Orientation特性");
}

var bPlayerShade = false
// 首先，定义一个摇动的阀值
var SHAKE_THRESHOLD = 2000;
// 定义一个变量保存上次更新的时间
var last_update = 0;
// 紧接着定义x、y、z记录三个轴的数据以及上一次出发的时间
var x;
var y;
var z;
var last_x;
var last_y;
var last_z;

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
    surportRotation = false
    alert("移动浏览器不支持运动传感事件 ");
};

BasicGame.Game.prototype = {
    create: function () {
        this.bRunBg = true
        this.offsetY = 0
        this.gamespeed = -80
        this.longest = localData.get('longest') || 0
        this.mycoin = localData.get('mycoin') || 0
        this.fuelCnt = 0 // 燃料
        this.portalCnt = 0 // 燃料
        this.useEffect = false // 正在使用大招加速

        this.bg = new BasicGame.BackGround(this.game)
        this.game.add.existing(this.bg);

        this.killGroup = this.game.add.group();
        this.killGroup.enableBody = true;       

        this.hitGroup = this.game.add.group();
        this.hitGroup.enableBody = true;   

        this.toolsGroup = this.game.add.group();
        this.toolsGroup.enableBody = true;

        this.allResGroup = this.game.add.group();
        this.allResGroup.enableBody = true;                 

        this.player = new BasicGame.Player(this.game, this.game.width/2, this.game.height/2-200)
        this.game.add.existing(this.player);    

        this.master = this.game.add.sprite(this.game.width/2,-300,'master')
        this.master.anchor.set(0.5) 
        this.game.physics.enable(this.master, Phaser.Physics.ARCADE); 
        this.game.time.events.loop(Phaser.Timer.SECOND, function () {
            if (this.useEffect == false) {
                this.master.y += 1
            };
        }, this); 

        this.style = {font: '25px Arial', fill: '#ffffff', align: 'center', fontWeight: 'bold', stroke: '#000000', strokeThickness: 6};
        this.scoreText = this.game.add.text(this.game.width-100, 100, "0", this.style);
        this.scoreText.anchor.set(0.5); 

        this.longestText = this.game.add.text(this.game.width-100, 160, "best score:0", this.style);
        this.longestText.anchor.set(0.5);  

        this.fuelCntText = this.game.add.text(100, 220, "fuel:0", this.style);
        this.fuelCntText.anchor.set(0.5); 

        this.rocket = this.game.add.button(100,220,'rocket',function () {
            if (this.useEffect == false) {
                this.fuelCnt = 0
                // 此处实现加速效果
                this.fuelUp()
            };
        }, this)   
        this.rocket.anchor.set(1.2)       
        // this.game.add.tween(this.rocket.scale).to({ x: 1.2,y:1.4 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 
        this.portalCntText = this.game.add.text(100, 160, "portal:0", this.style);
        this.portalCntText.anchor.set(0.5); 

        this.portalBtn = this.game.add.button(100,160,'lightingbase',function () {
            if (this.useEffect == false) {
                this.portalCnt = 0
                // 此处实现加速效果传送门
                this.createPortal()
            };
        }, this)   
        this.portalBtn.anchor.set(1.2)  

        this.mycoinText = this.game.add.text(100, 280, 'myCoin:0', this.style);
        this.mycoinText.anchor.set(0.5);         

        this.masterDistance = this.game.add.text(100, 100,'0', this.style);
        this.masterDistance.anchor.set(0.5);  

        this.game.time.events.loop(Phaser.Timer.SECOND*4, function () {
            if (this.killGroup.length+this.hitGroup.length <= 0) {  
                var type = this.game.rnd.integerInRange(1, 2);         
                if (type == 1 && this.fuelCnt < maxFuelCnt && this.useEffect == false) {
                    this.createfuel() 
                };
                if (type == 2 && this.portalCnt < maxPortalCnt && this.useEffect == false) {
                    this.createPortalRes()
                };                
            };
        }, this);  

        this.game.time.events.loop(Phaser.Timer.SECOND*6, function () {
            if (this.useEffect == false) {
                this.createCoin() 
            };
        }, this);          

        this.game.time.events.loop(Phaser.Timer.SECOND*6, function () {
            if (this.hitGroup.length+this.killGroup.length > 1) { 
            }else{
                if (this.useEffect == true) {return ;};
                var newY = this.game.height+200
                for (var i = 0; i < 3; i++) {
                   newY = this.createEnemy(newY) 
                };
            };
        }, this);   
        this.game.time.events.start();   
    },

    update: function () {
        // 手机感应
        if (gammadirection>20 || gammadirection<-20) {
            this.player.angle = gammadirection 
            if (this.player.angle > 0) {
                this.player.rocket.angle = -gammadirection
            } else{
                this.player.rocket.angle = 360-gammadirection
            };
        }else{
            this.player.rocket.angle = 0
            this.player.angle = 0
        };
        if (betadirection>60) {
            this.player.rocket.angle = -180
            this.player.angle = 180
        };
        playerRotation = Math.ceil((this.player.angle+360)%360)

        //数值 this.game.playerFrame
        this.scoreText.text = this.bg.distance
        this.longestText.text = "best score:"+this.longest 
        this.fuelCntText.text = "fuel:"+this.fuelCnt
        this.portalCntText.text = "portal:"+this.portalCnt
        this.mycoinText.text = "myCoin:"+this.mycoin
        var twoheight = this.master.height/2+this.player.height/2
        this.masterDistance.text = Math.max(Math.ceil(this.game.physics.arcade.distanceBetween(this.master,this.player)-twoheight),0)

        //与master碰撞
        this.game.physics.arcade.overlap(this.player,this.master, function () {
            this.quitGame();
        }, null, this);           
        //与killitem碰撞
        this.game.physics.arcade.overlap(this.player,this.killGroup, function () {
            this.quitGame();
        }, null, this);         
        //与hititem碰撞  
        this.game.physics.arcade.collide(this.player,this.hitGroup, function () {
            this.bRunBg = false
        }, null, this); 
        //与tools碰撞  
        this.game.physics.arcade.collide(this.player,this.toolsGroup, function (player,tools) {
            // if (this.toolsGroup.getFirstAlive().name == 'portal' && this.useEffect == false) {
            if (tools.name == 'portal' && this.useEffect == false) {
                // this.PortalUp(this.toolsGroup.getFirstAlive())
                this.PortalUp(tools)
            };
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

        this.toolsGroup.forEachExists(function(item){
            if (this.bRunBg == false) {
                item.body.moves = false
            }else{
                item.body.moves = true
            };            
            if (item.y < 0) {
                item.kill();
                this.toolsGroup.remove(item)
            };
        }, this); 

        this.allResGroup.forEachExists(function(item){          
            if (item.y < 0) {
                item.kill();
                this.allResGroup.remove(item)
            };
        }, this);                 

        if (this.bRunBg == false) {
            if (this.useEffect == false) {
                if (this.master.y > 0) {
                    this.master.y = this.master.y + 0.5 + this.offsetY // 怪物逼近
                    this.offsetY += 0.05
                } else{
                    this.master.y = this.master.y + 0.5 // 怪物逼近
                };
            };
        } else{
            this.bg.updateBg()// 刷新背景图
        };  

        if (this.fuelCnt == maxFuelCnt) {
            this.rocket.visible = true 
            this.fuelCntText.visible = false
        } else{
            this.rocket.visible = false 
            this.fuelCntText.visible = true
        };    

        if (this.portalCnt == maxPortalCnt) {
            this.portalBtn.visible = true 
            this.portalCntText.visible = false
        } else{
            this.portalBtn.visible = false 
            this.portalCntText.visible = true
        };              
    },

    quitGame: function (pointer) {
        //死亡特效
        this.bRunBg = false
        this.killGroup.removeAll();
        this.hitGroup.removeAll();
        this.toolsGroup.removeAll();
        this.allResGroup.removeAll();
        var dead = this.game.add.sprite(this.player.x, this.player.y, 'dead');
        dead.anchor.set(0.5)
        dead.scale.set(3)
        this.player.kill();
        var ani = dead.animations.add('bao');
        dead.animations.play('bao', 10, false);
        ani.onComplete.add(function () {
            dead.kill();
            this.bRunBg = true
            this.offsetY = 0
            this.fuelCnt = 0 // 燃料
            this.portalCnt = 0 // 燃料
            if (this.bg.distance > this.longest) {
                this.longest = this.bg.distance
                localData.set('longest',this.longest)
            };
            this.state.start('MainMenu');
        }, this);
    },

    render: function () {
        // this.game.debug.spriteInfo(this.game, 64, 64);
    },

    createEnemy: function (y) {
        var nextEnemyY = 0
        var type = this.game.rnd.integerInRange(1, 15);
        if (surportRotation == false) {
            if (type == 8 || type == 9) {
                type = 12
            };
        };
        // type = 15
        //石墙
        if (type == 1) {
            nextEnemyY = y+300 // 80是enemy高度
            var fence = this.game.add.sprite(this.game.width/2, y, 'zhalans', 'ground_grass.png', this.hitGroup);
            fence.anchor.set(0.5)
            fence.inputEnabled = true;
            fence.events.onInputDown.add(function  () {
                if (fence.frameName == 'ground_grass_broken.png') {
                    if (this.hitGroup.getFirstAlive() == fence) {
                        this.bRunBg = true;
                    };
                    this.hitGroup.remove(fence)
                    fence.kill()
                };
                fence.frameName = 'ground_grass_broken.png'
            }, this);  
            this.hitGroup.setAll('body.gravity.y', this.gamespeed);     
            this.hitGroup.setAll('body.moves', false); 
        };

        //飞鸟
        if (type == 2) {
            nextEnemyY = y+300 // 80是enemy高度
            var bird = this.game.add.sprite(this.game.width-200, y, 'bird', null, this.killGroup);
            this.game.add.tween(bird).to({ x: 200 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 
            bird.anchor.set(0.5)
            bird.animations.add('fly');
            bird.animations.play('fly', 30, true);
            bird.scale.set(1.2)     
            bird.inputEnabled = true;
            bird.events.onInputDown.add(function  () {
                bird.animations.stop();
                this.killGroup.remove(bird)
                bird.kill()
            }, this); 

            this.killGroup.setAll('body.gravity.y', this.gamespeed);    
            this.killGroup.setAll('body.moves', false);                              
        };

        //箭头
        if (type == 3) {
            nextEnemyY = y+300 // 80是enemy高度
            var typeArrow = this.game.rnd.integerInRange(1, 2);
            var perX

            var arrow = this.game.add.sprite(this.game.width/2, y, 'arrow', null, this.hitGroup);
            arrow.anchor.set(0.5)
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
            var lock = this.game.add.sprite(this.game.width/2, y, locks[lockType], null, this.hitGroup);
            lock.anchor.set(0.5)
            lock.name = lockType

            var keyTypeL = this.game.rnd.integerInRange(0, 1)
            var keyL = this.game.make.sprite(-300, 100, keys[keyTypeL]);
            lock.addChild(keyL);
            keyL.name = keyTypeL
            keyL.anchor.set(0.5)
            keyL.inputEnabled = true;           
            keyL.input.enableDrag();
            var interacteFunc = function  (keyL) {
                if (Phaser.Rectangle.intersects(lock.getBounds(), keyL.getBounds())) {
                    if (lock.name == keyL.name) {
                        if (this.hitGroup.getFirstAlive() == lock) {
                            this.bRunBg = true;
                        };
                        this.hitGroup.remove(lock);
                        lock.kill();
                    } else{
                        var tweenMaster = this.game.add.tween(keyL)
                        tweenMaster.to({ y: 100,x:-300 }, 1000, Phaser.Easing.Quadratic.InOut); 
                        tweenMaster.start();
                    };
                };
            }
            keyL.events.onDragUpdate.add(interacteFunc,this);  
            keyL.events.onDragStop.add(interacteFunc,this);  

            if (keyTypeL === 0) {keyTypeR = 1};
            if (keyTypeL === 1) {keyTypeR = 0};
            var keyR = this.game.make.sprite(300, 100, keys[keyTypeR]);
            lock.addChild(keyR);
            keyR.name = keyTypeR
            keyR.anchor.set(0.5)
            keyR.inputEnabled = true;           
            keyR.input.enableDrag();
            var interacteFuncR = function  (keyR) {
                if (Phaser.Rectangle.intersects(lock.getBounds(), keyR.getBounds())) {
                    if (lock.name == keyR.name) {
                        if (this.hitGroup.getFirstAlive() == lock) {
                            this.bRunBg = true;
                        };
                        this.hitGroup.remove(lock);
                        lock.kill();
                    } else{
                        var tweenMaster = this.game.add.tween(keyR)
                        tweenMaster.to({ y: 100,x:300 }, 1000, Phaser.Easing.Quadratic.InOut); 
                        tweenMaster.start();                      
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
            nextEnemyY = y+800 // 80是enemy高度
            var poss = [-150,0,150]
            var cards = ['card_26','card_28','card_38']
            cards = Phaser.ArrayUtils.shuffle(cards)

            var cardBase = this.game.add.sprite(this.game.width/2, y, cards[0], null, this.hitGroup);
            cardBase.anchor.set(0.5)
            // this.game.add.tween(cardBase).to({ alpha: 0 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 

            var card1 = this.game.add.sprite(poss[0], 200, cards[0]);
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
            var card2 = this.game.add.sprite(poss[1], 200, cards[1]);
            cardBase.addChild(card2);
            card2.anchor.set(0.5)
            var card3 = this.game.add.sprite(poss[2], 200, cards[2]);
            cardBase.addChild(card3);
            card3.anchor.set(0.5)
            this.game.time.events.loop(Phaser.Timer.SECOND/1.8, function () {
                // this.masterGo(10)
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
            nextEnemyY = y+400 // 80是enemy高度
            var textshow
            var right = false
            var initbord = function () {
                var a = Math.ceil(Math.random()*100)
                var b = Math.ceil(Math.random()*100)
                var arr = ['+','-']
                var subs = [-20,-10,0,10,20,0,0]
                subs = Phaser.ArrayUtils.shuffle(subs)
                var sub = subs[0]
                var sum = a+b+sub
                if (sub == 0) {
                    right = true
                };
                var str = a+arr[0]+b+'='+sum
                textshow.text = str
            }

            var mathBord = this.game.add.sprite(this.game.width/2, y, 'fence', null, this.hitGroup);
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
                    // this.masterGo(10)
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
                    // this.masterGo(10)
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
            nextEnemyY = y+800 // 80是enemy高度
            var pics = []
            for (var i = 0; i < 9; i++) {
                if (i < 8) {
                    pics[i] = 'grass1'
                } else{
                    pics[i] = 'grass2'
                };
            };

            var poss = [
                        [-90,-90],[0,-90],[90,-90],
                        [-90,0],[0,0],[90,0],
                        [-90,90],[0,90],[90,90]
                        ]
            poss = Phaser.ArrayUtils.shuffle(poss)

            var diffBord = this.game.add.sprite(this.game.width/2, y, 'background', null, this.hitGroup);
            diffBord.anchor.set(0.5)

            for (var i = 0; i < pics.length; i++) {
                var btn
                if (i < 8) {
                    btn = this.game.make.button(0,0, pics[i],function () {
                        // this.masterGo(10)
                    }, this, 2, 1, 0)
                } else{
                    btn = this.game.make.button(0,0, pics[i],function () {
                        // this.masterBack(30)
                        if (this.hitGroup.getFirstAlive() == diffBord) {
                            this.bRunBg = true;
                        };
                        this.hitGroup.remove(diffBord)
                        diffBord.kill();
                    }, this, 2, 1, 0)
                };
                diffBord.addChild(btn);
                btn.anchor.set(0.5)
                btn.x = poss[i][0]
                btn.y = poss[i][1]            
            }; 
            this.hitGroup.setAll('body.gravity.y', this.gamespeed);   
            this.hitGroup.setAll('body.moves', false);                              
        };    

        //主角旋转
        if (type == 8) {
            nextEnemyY = y+300 // 80是enemy高度
            var playerBord = this.game.add.sprite(this.game.width/2, y, 'players',GlobalPlayerFrame, this.hitGroup);
            playerBord.anchor.set(0.5)
            playerBord.scale.set(1) 

            var angles = [300,315,330,0,30,45,60,180]
            angles = Phaser.ArrayUtils.shuffle(angles)
            playerBord.angle = angles[0]
            this.game.time.events.loop(Phaser.Timer.SECOND/60, function () {
                if (Math.abs(playerRotation - angles[0])<5) {
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

        //摇一摇
        if (type == 9) {
            nextEnemyY = y+300 // 80是enemy高度
            var shade = this.game.add.sprite(this.game.width/2, y, 'fence', null, this.hitGroup);
            shade.anchor.set(0.5)
            shade.scale.x = 4
            this.game.time.events.loop(Phaser.Timer.SECOND/60, function () {
                if (bPlayerShade == true) {
                    if (this.hitGroup.getFirstAlive() == shade) {
                        this.bRunBg = true;
                    };
                    this.hitGroup.remove(shade)
                    shade.kill()
                };  
            }, this); 

            var textshow = this.game.make.text(0, 0, "摇一摇设备！", this.style);
            shade.addChild(textshow);
            textshow.anchor.set(0.5);
            textshow.scale.set(0.5,1) 

            this.hitGroup.setAll('body.gravity.y', this.gamespeed);     
            this.hitGroup.setAll('body.moves', false);                              
        };     

        //双向箭头
        if (type == 10) {
            nextEnemyY = y+300 // 80是enemy高度

            var arrowBord = this.game.add.sprite(this.game.width/2, y, 'touming', null, this.hitGroup);
            arrowBord.anchor.set(0.5)
            arrowBord.killL = false           
            arrowBord.killR = false           

            var perX
            var arrowL = this.game.make.sprite(180, 0, 'drag');
            arrowBord.addChild(arrowL);
            arrowL.anchor.set(0.5)
            arrowL.angle = 180
            arrowL.inputEnabled = true;
            arrowL.input.allowHorizontalDrag = true;
            arrowL.input.allowVerticalDrag = false;            
            arrowL.input.enableDrag();
            arrowL.events.onDragStart.add(function () {
                perX = arrowL.x
            }, this);
            arrowL.events.onDragUpdate.add(function () {
                if ((arrowL.x - perX) < 0) {arrowL.x = perX};
                if (Math.abs(arrowL.x - perX) >= 80) {
                    var tweenArrowL = this.game.add.tween(arrowL)
                    tweenArrowL.to({ x: this.game.width+500 }, 1000, Phaser.Easing.Quadratic.InOut); 
                    tweenArrowL.start();
                    tweenArrowL.onComplete.addOnce(function () {
                        arrowL.kill();
                        arrowBord.killL = true
                    }, this);           
                };
            }, this);  

            var perX1
            var arrowR = this.game.make.sprite(-180, 0, 'drag');
            arrowBord.addChild(arrowR);
            arrowR.anchor.set(0.5)
            arrowR.inputEnabled = true;
            arrowR.input.allowHorizontalDrag = true;
            arrowR.input.allowVerticalDrag = false;            
            arrowR.input.enableDrag();
            arrowR.events.onDragStart.add(function () {
                perX1 = arrowR.x
            }, this);
            arrowR.events.onDragUpdate.add(function () {
                if ((arrowR.x - perX1) > 0) {arrowR.x = perX1};
                if (Math.abs(arrowR.x - perX1) >= 80) {
                    var tweenArrowR = this.game.add.tween(arrowR)
                    tweenArrowR.to({ x: -500 }, 1000, Phaser.Easing.Quadratic.InOut); 
                    tweenArrowR.start();
                    tweenArrowR.onComplete.addOnce(function () {
                        arrowR.kill();
                        arrowBord.killR = true
                    }, this);           
                };  
            }, this);  

            this.game.time.events.loop(Phaser.Timer.SECOND/120, function () {
                if (arrowBord.killL == true && arrowBord.killR == true) {
                    if (this.hitGroup.getFirstAlive() == arrowBord) {
                        this.bRunBg = true;
                    };
                    this.hitGroup.remove(arrowBord)
                    arrowBord.kill()
                };
            }, this);             

            this.hitGroup.setAll('body.gravity.y', this.gamespeed);                              
            this.hitGroup.setAll('body.moves', false);                              
        };     

        //闪电
        if (type == 11) {
            nextEnemyY = y+500 // 80是enemy高度
            var fence = this.game.add.sprite(this.game.width/2, y, 'fire', null, this.killGroup);
            fence.anchor.set(0.5)
            fence.scale.set(2)
            fence.body.setSize(158, 30,0, 0);
            fence.animations.add('fire');
            fence.animations.play('fire', 30, true);              

            var perY
            var zha = this.game.make.sprite(150, -80, 'zha')
            fence.addChild(zha);
            zha.scale.set(0.5)
            zha.anchor.set(0.5)
            zha.inputEnabled = true;
            zha.input.allowHorizontalDrag = false;
            zha.input.allowVerticalDrag = true;            
            zha.input.enableDrag();
            zha.events.onDragStart.add(function () {
                perY = zha.y
            }, this);           
            zha.events.onDragUpdate.add(function () {
                if ((zha.y - perY) < 0) {zha.y = perY};
                if ((zha.y-perY)>100) {
                    this.killGroup.remove(fence)
                    fence.kill()
                };
            }, this);   

            var btn = this.game.make.sprite(96, -25, 'firebase')           
            fence.addChild(btn);

            this.killGroup.setAll('body.gravity.y', this.gamespeed);     
            this.killGroup.setAll('body.moves', false);                              
        };     

        //排序1-9 a-z
        if (type == 12) {
            nextEnemyY = y+400 // 80是enemy高度

            var arrowBord = this.game.add.sprite(this.game.width/2, y, 'touming', null, this.hitGroup);
            arrowBord.anchor.set(0.5)
            var typesort = this.game.rnd.integerInRange(0, 1);
            var nums
            if (typesort == 0) {
                nums = ['text_0','text_1','text_2','text_3','text_4','text_5','text_6','text_7','text_8','text_9'] 
            } else{
                nums = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'] 
            };

            nums = Phaser.ArrayUtils.shuffle(nums)
            var sortNums = [nums[0],nums[1],nums[2],nums[3]]
            sortNums.sort();

            var poses = [-240,-80,80,240] 
            poses = Phaser.ArrayUtils.shuffle(poses)

            var btn1 = this.game.make.button(poses[0],0, sortNums[0],function () {
                btn1.kill();
                arrowBord.killbtn1 = true
            }, this)
            btn1.anchor.set(0.5)
            arrowBord.addChild(btn1);
            var btn2 = this.game.make.button(poses[1],0, sortNums[1],function () {
                if (arrowBord.killbtn1 == true) {
                    btn2.kill();
                    arrowBord.killbtn2 = true
                }else{
                    // this.masterGo(20)
                };                
            }, this)
            arrowBord.addChild(btn2);
            btn2.anchor.set(0.5)
            var btn3 = this.game.make.button(poses[2],0, sortNums[2],function () {
                if (arrowBord.killbtn2 == true) {
                    btn3.kill();
                    arrowBord.killbtn3 = true
                }else{
                    // this.masterGo(20)
                };                
            }, this)
            arrowBord.addChild(btn3);
            btn3.anchor.set(0.5)
            var btn4 = this.game.make.button(poses[3],0, sortNums[3],function () {
                if (arrowBord.killbtn3 == true) {
                    btn4.kill();
                    if (this.hitGroup.getFirstAlive() == arrowBord) {
                        this.bRunBg = true;
                    };
                    this.hitGroup.remove(arrowBord)
                    arrowBord.kill()                    
                }else{
                    // this.masterGo(20)
                };                
            }, this)
            arrowBord.addChild(btn4);              
            btn4.anchor.set(0.5)

            this.hitGroup.setAll('body.gravity.y', this.gamespeed);                              
            this.hitGroup.setAll('body.moves', false);                                           
        };     

        //移动闪电
        if (type == 13) {
            nextEnemyY = y+800 // 80是enemy高度
            var fence = this.game.add.sprite(this.game.width/2, y, 'lightning', null, this.killGroup);
            fence.anchor.set(0.5)
            fence.body.setSize(220,20,0,0);
            fence.scale.set(2)
            fence.animations.add('lingining');
            fence.animations.play('lingining', 30, true);            

            var type = this.game.rnd.integerInRange(1, 2);
            if (type == 1) {
                var btn1 = this.game.make.sprite(150, 0, 'lightingbase')
                fence.addChild(btn1);
                btn1.anchor.set(0.5)
                btn1.angle = 180
                var typepos = this.game.rnd.integerInRange(1, 2);
                if (typepos == 1) {
                    btn1.x = -150 ;
                };
                btn1.inputEnabled = true;
                btn1.events.onInputUp.add(function () {
                    fence.visible = true
                });
                btn1.events.onInputOver.add(function () {
                    fence.visible = false
                    this.bRunBg = true;
                });     
                btn1.events.onInputOut.add(function () {
                    fence.visible = false
                });                          
            } else{
                var btn1,btn2
                btn1 = this.game.make.sprite(150, 0, 'lightingbase')
                btn1.angle = 180
                fence.addChild(btn1);
                btn1.anchor.set(0.5)
                btn1.onput = false
                btn1.inputEnabled = true;
                btn1.events.onInputUp.add(function () {
                    btn1.onput = false
                    fence.visible = true
                });
                btn1.events.onInputOver.add(function () {
                    this.bRunBg = true;
                    btn1.onput = true
                    if (btn2.onput == true) {
                        fence.visible = false
                    };
                });     
                btn1.events.onInputOut.add(function () {
                    btn1.onput = true
                    if (btn2.onput == true) {
                        fence.visible = false
                    };
                });   

                btn2 = this.game.make.sprite(-150, 0, 'lightingbase')
                fence.addChild(btn2);
                btn2.anchor.set(0.5)
                btn2.onput = false
                btn2.inputEnabled = true;
                btn2.events.onInputUp.add(function () {
                    btn2.onput = false
                    fence.visible = true
                });
                btn2.events.onInputOver.add(function () {
                    this.bRunBg = true;
                    btn2.onput = true
                    if (btn1.onput == true) {
                        fence.visible = false
                    };
                });     
                btn2.events.onInputOut.add(function () {
                    btn2.onput = true
                    if (btn1.onput == true) {
                        fence.visible = false
                    };
                });                   
            };

            this.killGroup.setAll('body.gravity.y', this.gamespeed);     
            this.killGroup.setAll('body.moves', false);                              
        };  

        //夹子
        if (type == 14) {
            nextEnemyY = y+800 // 80是enemy高度
            var runL,runR,brun = true
            var jbL = this.game.add.sprite(0, y, 'jiaban', null, this.killGroup);
            jbL.anchor.set(0.5)
            jbL.body.setSize(59,259,0,0);
            runL = this.game.add.tween(jbL).to({ x: this.game.width/2 }, 3000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 

            var jbR = this.game.add.sprite(this.game.width, y, 'jiaban', null, this.killGroup);
            jbR.anchor.set(0.5)
            jbR.body.setSize(59,259,0,0);
            runR = this.game.add.tween(jbR).to({ x: this.game.width/2 }, 3000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 

            var stop = this.game.add.sprite(this.game.width-100, y-200, 'yes', null, this.killGroup);
            stop.anchor.set(0.5)
            stop.scale.set(3)
            stop.lw = runL
            stop.rw = runR
            stop.inputEnabled = true;
            stop.events.onInputDown.add(function(stop) {
                if (brun == true) {
                    stop.lw.pause();
                    stop.rw.pause();
                    brun = false
                } else{
                    stop.lw.resume();
                    stop.rw.resume();
                    brun = true
                };
            }, this);  

            this.killGroup.setAll('body.gravity.y', this.gamespeed);    
            this.killGroup.setAll('body.moves', false);                              
        };  

        //枪战
        if (type == 15) {
            nextEnemyY = y+300 // 80是enemy高度
            var bird = this.game.add.sprite(this.game.width-200, y, 'bird', null, this.killGroup);
            this.game.add.tween(bird).to({ x: 200 }, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true); 
            bird.anchor.set(0.5)
            bird.name = 'bird'
            bird.animations.add('fly');
            bird.animations.play('fly', 30, true);

            var gan = this.game.add.sprite(100, y-30, 'gan', null, this.toolsGroup);
            gan.anchor.set(0.5)
            gan.scale.set(0.5)
            gan.inputEnabled = true
            gan.bullets = new BasicGame.Bullets(this.game, 50);
            this.game.input.onDown.add(function () {
                if (gan.y > this.game.height/2 && gan.y <= this.game.height) {
                    gan.rotation = this.game.physics.arcade.angleToPointer(gan);
                    gan.bullets.fire(gan)
                };
            }, this);
            this.game.time.events.loop(Phaser.Timer.SECOND/60, function () {
                this.game.physics.arcade.overlap(gan.bullets, this.killGroup, function (bullet,bird) {
                    if (bird.name == 'bird') {
                        bird.animations.stop();
                        bullet.kill();
                        this.killGroup.remove(bird)
                        bird.kill()                    
                    };
                }, null, this);
            }, this); 

            this.killGroup.setAll('body.gravity.y', this.gamespeed);    
            this.killGroup.setAll('body.moves', false); 
            this.toolsGroup.setAll('body.gravity.y', this.gamespeed);    
            this.toolsGroup.setAll('body.moves', false);             
        };

        return nextEnemyY;                
    },

    //燃料 
    createfuel:function () {
        var type = this.game.rnd.integerInRange(1, 10);
        var rl
        if (type <= 5) {
            rl = this.game.add.sprite(50,this.game.height-100,'ranliao', null, this.toolsGroup)
        } else{
            rl = this.game.add.sprite(this.game.width-50,this.game.height-100,'ranliao', null, this.toolsGroup)
        };
        rl.anchor.set(0.5)
        rl.scale.set(0.1)
        var tweenFuel = this.game.add.tween(rl.scale)
        tweenFuel.to({ x: 3,y:3 }, 1000, Phaser.Easing.Quadratic.BackOut); 
        tweenFuel.start();

        rl.inputEnabled = true;
        rl.events.onInputDown.add(function  () {
            this.toolsGroup.remove(rl)
            rl.kill();
            this.fuelCnt += 1
        }, this); 
        this.toolsGroup.setAll('body.gravity.y', this.gamespeed);                        
        this.toolsGroup.setAll('body.moves', false);    
    },

    //传送门
    createPortalRes:function () {
        var type = this.game.rnd.integerInRange(1, 10);
        // 传送门
        var rl = this.game.add.sprite(this.game.width-50,this.game.height-100,'no', null, this.toolsGroup)
        if (type > 5) {
            rl.x = 50
        };
        rl.inputEnabled = true;
        rl.events.onInputDown.add(function  () {
            this.toolsGroup.remove(rl)
            rl.kill();
            this.portalCnt += 1
        }, this);    
        this.toolsGroup.setAll('body.gravity.y', this.gamespeed);                        
        this.toolsGroup.setAll('body.moves', false);                         
    },    

    //金币
    createCoin:function () {       
        var type = this.game.rnd.integerInRange(1, 10);
        var rl
        if (type <= 5) {
            rl = this.game.add.sprite(50,this.game.height+100,'jinbi', null, this.allResGroup)
        } else{
            rl = this.game.add.sprite(this.game.width-50,this.game.height+100,'jinbi', null, this.allResGroup)
        };
        rl.anchor.set(0.5)
        rl.scale.set(0.1)
        rl.body.gravity.y = -500
        var tweenFuel = this.game.add.tween(rl.scale)
        tweenFuel.to({ x: 1,y:1 }, 1000, Phaser.Easing.Quadratic.BackOut); 
        tweenFuel.start();

        rl.inputEnabled = true;
        rl.events.onInputDown.add(function  () {
            var run = this.game.add.tween(rl)
            run.to({ x: this.player.x,y:this.player.y-80 }, 600, Phaser.Easing.Quadratic.BackOut); 
            run.start();
            run.onComplete.addOnce(function () {
                this.allResGroup.remove(rl)
                rl.kill();
                this.mycoin = Number(this.mycoin) + 1
                localData.set('mycoin',this.mycoin)
            },this);
        }, this); 
        this.allResGroup.setAll('body.gravity.y', this.gamespeed*2);                        
    },    

    //传送门 heidong
    createPortal:function () {
        this.killGroup.removeAll();
        this.hitGroup.removeAll();
        this.bRunBg = true
        var door = this.game.add.sprite(this.game.width/2, this.game.height/2-90, 'heidong', null, this.toolsGroup);
        door.anchor.set(0.5)
        door.body.setSize(200, 30,0, 0);        
        door.name = 'portal'
        door.animations.add('heidong');
        door.animations.play('heidong', 30, true);    
        door.scale.set(0.1)
        var tweenFuel = this.game.add.tween(door.scale)
        tweenFuel.to({ x: 1,y:1 }, 1000, Phaser.Easing.Quadratic.BackOut); 
        tweenFuel.start();
        this.toolsGroup.setAll('body.gravity.y', this.gamespeed);                        
        this.toolsGroup.setAll('body.moves', false);    
    },    

    // 燃气加速
    fuelUp:function () {
        var up = true
        this.useEffect = true
        this.bRunBg = true
        this.masterBack(200,9000)
        this.killGroup.removeAll();
        this.hitGroup.removeAll();
        this.game.time.events.repeat(Phaser.Timer.SECOND/8, 40, function () {
            if (this.bg.offset < 44 && up == true) {
                this.bg.offset += 2
            } else{
                up = false
                this.bg.offset -= 2
            };
            if (this.bg.offset <= 4) {
                this.useEffect = false
                this.bg.offset = 4
            };
        }, this);
    },

    // 传送门加速
    PortalUp:function (portal) {
        var tweenPortal = this.game.add.tween(portal)
        tweenPortal.to({ y:5 }, 1500, Phaser.Easing.Quadratic.InOut); 
        tweenPortal.start(); 
        tweenPortal.onComplete.addOnce(function ( ) {
            portal.visible = false
            portal.y = this.game.height
        },  this);       
        this.player.visible = false
        var up = true
        this.useEffect = true
        this.bRunBg = true
        this.masterBack(280,9000)
        this.killGroup.removeAll();
        this.hitGroup.removeAll();
        this.game.time.events.repeat(Phaser.Timer.SECOND/8, 40, function () {
            if (this.bg.offset < 64 && up == true) {
                this.bg.offset += 3
            } else{
                up = false
                this.bg.offset -= 3
            };
            if (this.bg.offset <= 4) {
                this.useEffect = false
                this.bg.offset = 4
                this.player.visible = true
                portal.y = 80
                portal.visible = true
                this.player.y = 100
                var tweenplayer = this.game.add.tween(this.player)
                tweenplayer.to({ y: this.game.height/2-200 }, 1000, Phaser.Easing.Quadratic.InOut); 
                tweenplayer.start();
            };
        }, this);
    },    

    masterGo:function (distance) {
        distance = distance || 20
        var toY = this.master.y + distance
        var tweenMaster = this.game.add.tween(this.master)
        tweenMaster.to({ y: toY }, 4000, Phaser.Easing.Quadratic.InOut); 
        tweenMaster.start();
    },

    masterBack:function (distance,cd) {
        distance = distance || 20
        var toY = this.master.y - distance
        var tweenMaster = this.game.add.tween(this.master)
        tweenMaster.to({ y: toY }, cd || 4000, Phaser.Easing.Quadratic.InOut); 
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

