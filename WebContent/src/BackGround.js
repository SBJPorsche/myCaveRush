BasicGame.BackGround = function (game) {

    Phaser.Group.call(this, game);

    this.groupbg1 = game.add.group()
    this.groupbg1.create(this.game.width/2,0,'preloaderBackground').anchor.set(0.5,0)
    this.groupbg1.create(this.game.width/2,0,'walls').anchor.set(0.5,0)
    // this.groupbg1.create(this.game.width/2,0,'ropeNode').anchor.set(0.5,0)

    this.groupbg2 = game.add.group()
    this.groupbg2.create(this.game.width/2,this.groupbg1.height,'preloaderBackground').anchor.set(0.5,0)
    this.groupbg2.create(this.game.width/2,this.groupbg1.height,'walls').anchor.set(0.5,0)
    // this.groupbg2.create(this.game.width/2,this.groupbg1.height,'ropeNode').anchor.set(0.5,0)    

    this.stop = false

    this.distance = 0
    return this;
}

BasicGame.BackGround.prototype = Object.create(Phaser.Group.prototype);
BasicGame.BackGround.prototype.constructor = BasicGame.BackGround;

BasicGame.BackGround.prototype.updateBg = function () {
    if (this.stop == false) {
        this.distance ++ 
        this.groupbg1.y = this.groupbg1.y - 4
        this.groupbg2.y = this.groupbg2.y - 4
        if (this.groupbg1.y < -this.groupbg1.height) {
            this.groupbg1.y = 0
        };
        if (this.groupbg2.y < -this.groupbg2.height) {
            this.groupbg2.y = 0
        };   
    };
};